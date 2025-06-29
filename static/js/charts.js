// 전역 Highcharts 설정
Highcharts.setOptions({
    lang: {
        thousandsSep: ',',
    },
    colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800', '#00E396', '#FEB019', '#4CAF50', '#FF4560', '#775DD0'],
    chart: {
        style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        animation: true,
        backgroundColor: '#ffffff',
        borderRadius: 8
    },
    title: {
        style: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#2d3748'
        }
    },
    subtitle: {
        style: {
            color: '#718096'
        }
    },
    xAxis: {
        labels: {
            style: {
                color: '#4a5568'
            }
        },
        lineColor: '#e2e8f0',
        tickColor: '#e2e8f0'
    },
    yAxis: {
        labels: {
            style: {
                color: '#4a5568'
            }
        },
        gridLineColor: '#e2e8f0'
    },
    legend: {
        itemStyle: {
            color: '#2d3748',
            fontWeight: '500'
        },
        itemHoverStyle: {
            color: '#2c5282'
        }
    },
    plotOptions: {
        series: {
            animation: {
                duration: 1000
            },
            states: {
                hover: {
                    brightness: 0.1
                }
            }
        }
    }
});

let globalData = null;
let currentDataType = '자살자수';

// 데이터 로드
async function loadData() {
    try {
        const response = await fetch('/static/final_data.json');
        if (!response.ok) {
            throw new Error('데이터를 불러올 수 없습니다.');
        }
        globalData = await response.json();
        
        // 지역 옵션 설정
        const regions = Object.keys(globalData);
        const regionSelects = ['chart2Region', 'chart3Region'];
        
        regionSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = regions.map(region => 
                `<option value="${region}" ${region === '전국' ? 'selected' : ''}>${region}</option>`
            ).join('');
        });

        // 초기 차트 렌더링
        updateAllCharts();
    } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
    }
}

// 모든 차트 업데이트
function updateAllCharts() {
    const chart2Region = document.getElementById('chart2Region').value;
    const chart3Region = document.getElementById('chart3Region').value;
    const chart3Year = document.getElementById('chart3Year').value;

    // 제목 업데이트
    document.getElementById('chart1Title').textContent = `지역별 ${currentDataType} 추이 (2019-2023)`;
    document.getElementById('chart2Title').textContent = `${chart2Region} 연령별 ${currentDataType} 추이`;
    document.getElementById('chart3Title').textContent = `${chart3Region} 성별 연령구간별 ${currentDataType}`;

    renderChart1(currentDataType);
    renderChart2(currentDataType, chart2Region);
    renderChart3(currentDataType, chart3Region, chart3Year);
}

// 차트 1: 지역별 추이
function renderChart1(dataType) {
    try {
        const years = ['2019', '2020', '2021', '2022', '2023'];
        const regions = Object.keys(globalData).filter(region => region !== '전국');
        
        // 2023년 기준으로 상위 5개 지역 찾기
        const top5Regions = regions
            .map(region => {
                try {
                    const value = globalData[region]?.[dataType]?.['2023']?.['전체']?.['계'] || 0;
                    return { region, value };
                } catch (error) {
                    console.error(`Error processing region ${region}:`, error);
                    return { region, value: 0 };
                }
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 5)
            .map(item => item.region);

        const series = regions.map(region => {
            try {
                return {
                    name: region,
                    data: years.map(year => {
                        try {
                            return globalData[region]?.[dataType]?.[year]?.['전체']?.['계'] || 0;
                        } catch (error) {
                            console.error(`Error getting data for ${region} in ${year}:`, error);
                            return 0;
                        }
                    }),
                    visible: top5Regions.includes(region),
                    marker: {
                        symbol: 'circle'
                    }
                };
            } catch (error) {
                console.error(`Error creating series for ${region}:`, error);
                return {
                    name: region,
                    data: years.map(() => 0),
                    visible: false,
                    marker: {
                        symbol: 'circle'
                    }
                };
            }
        });

        Highcharts.chart('chart1', {
            chart: {
                type: 'line'
            },
            title: {
                text: `지역별 ${dataType} 추이 (2019-2023)`
            },
            xAxis: {
                categories: years.map(year => year + '년'),
                crosshair: true
            },
            yAxis: {
                title: {
                    text: dataType
                },
                labels: {
                    formatter: function() {
                        return this.value.toLocaleString();
                    }
                }
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                formatter: function() {
                    let s = `<b>${this.x}</b><br/>`;
                    this.points.forEach(point => {
                        s += `${point.series.name}: <b>${point.y.toLocaleString()}</b><br/>`;
                    });
                    return s;
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    },
                    events: {
                        legendItemClick: function() {
                            return true;
                        }
                    }
                }
            },
            series: series
        });
    } catch (error) {
        console.error('차트1 렌더링 중 오류 발생:', error);
    }
}

// 차트 2: 연령별 추이
function renderChart2(dataType, region) {
    try {
        const years = ['2019', '2020', '2021', '2022', '2023'];
        const ageGroups = ["15세 미만", "15 - 64세", "65세 이상", "80세이상"];
        const chartOptions = {
            chart: { type: 'line' },
            xAxis: { 
                categories: years.map(year => year + '년'),
                crosshair: true
            },
            yAxis: { 
                title: { text: dataType },
                labels: {
                    formatter: function() {
                        return this.value.toLocaleString();
                    }
                }
            },
            tooltip: {
                shared: true,
                crosshairs: true,
                formatter: function() {
                    let s = `<b>${this.x}</b><br/>`;
                    this.points.forEach(point => {
                        s += `${point.series.name}: <b>${point.y.toLocaleString()}</b><br/>`;
                    });
                    return s;
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                        symbol: 'circle'
                    }
                }
            }
        };

        // 전체 인구
        Highcharts.chart('chart2_total', {
            ...chartOptions,
            title: { text: `전체 인구 ${dataType} 추이` },
            series: ageGroups.map(age => ({
                name: age,
                data: years.map(year => globalData[region]?.[dataType]?.[year]?.['전체']?.[age] || 0)
            }))
        });

        // 남성
        Highcharts.chart('chart2_male', {
            ...chartOptions,
            title: { text: `남성 ${dataType} 추이` },
            series: ageGroups.map(age => ({
                name: age,
                data: years.map(year => globalData[region]?.[dataType]?.[year]?.['남성']?.[age] || 0)
            }))
        });

        // 여성
        Highcharts.chart('chart2_female', {
            ...chartOptions,
            title: { text: `여성 ${dataType} 추이` },
            series: ageGroups.map(age => ({
                name: age,
                data: years.map(year => globalData[region]?.[dataType]?.[year]?.['여성']?.[age] || 0)
            }))
        });
    } catch (error) {
        console.error('차트2 렌더링 중 오류 발생:', error);
    }
}

// 차트 3: 성별 연령구간별 피라미드
function renderChart3(dataType, region, year) {
    try {
        const ageGroups = [
            '0-4세', '5-9세', '10-14세', '15-19세', '20-24세', '25-29세',
            '30-34세', '35-39세', '40-44세', '45-49세', '50-54세', '55-59세',
            '60-64세', '65-69세', '70-74세', '75-79세', '80-84세', '85-89세', '90세이상'
        ].reverse();

        const maleData = [];
        const femaleData = [];

        ageGroups.forEach(group => {
            try {
                let maleValue, femaleValue;
                
                if (group === '0-4세') {
                    maleValue = (globalData[region]?.[dataType]?.[year]?.['남성']?.['0세'] || 0) +
                               (globalData[region]?.[dataType]?.[year]?.['남성']?.['1 - 4세'] || 0);
                    femaleValue = (globalData[region]?.[dataType]?.[year]?.['여성']?.['0세'] || 0) +
                                 (globalData[region]?.[dataType]?.[year]?.['여성']?.['1 - 4세'] || 0);
                } else {
                    const dataKey = group.replace('-', ' - ');
                    maleValue = globalData[region]?.[dataType]?.[year]?.['남성']?.[dataKey] || 0;
                    femaleValue = globalData[region]?.[dataType]?.[year]?.['여성']?.[dataKey] || 0;
                }

                maleData.push(-maleValue);
                femaleData.push(femaleValue);
            } catch (error) {
                console.error(`Error processing age group ${group}:`, error);
                maleData.push(0);
                femaleData.push(0);
            }
        });

        Highcharts.chart('chart3', {
            chart: {
                type: 'bar'
            },
            title: {
                text: `${year}년 ${region} 성별 연령구간별 ${dataType}`
            },
            subtitle: {
                text: '남성 ← | → 여성'
            },
            xAxis: [{
                categories: ageGroups,
                reversed: false,
                labels: {
                    step: 1
                },
                accessibility: {
                    description: '연령대'
                }
            }, {
                opposite: true,
                reversed: false,
                categories: ageGroups,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function() {
                        return Math.abs(this.value).toLocaleString();
                    }
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    borderWidth: 0
                }
            },
            tooltip: {
                formatter: function() {
                    return `<b>${this.series.name}, ${this.point.category}</b><br/>` +
                           `${dataType}: ${Math.abs(this.point.y).toLocaleString()}`;
                }
            },
            series: [{
                name: '남성',
                data: maleData,
                color: '#4169E1'
            }, {
                name: '여성',
                data: femaleData,
                color: '#FF69B4'
            }]
        });
    } catch (error) {
        console.error('차트3 렌더링 중 오류 발생:', error);
    }
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 데이터 로드
    loadData();

    // 전역 데이터 타입 변경
    document.getElementById('globalDataType').addEventListener('change', (e) => {
        currentDataType = e.target.value;
        updateAllCharts();
    });

    // 섹션 1 컨트롤
    document.getElementById('showCount').addEventListener('click', () => {
        currentDataType = '자살자수';
        document.getElementById('showCount').classList.add('bg-blue-500', 'text-white');
        document.getElementById('showCount').classList.remove('bg-gray-200', 'text-gray-700');
        document.getElementById('showRate').classList.add('bg-gray-200', 'text-gray-700');
        document.getElementById('showRate').classList.remove('bg-blue-500', 'text-white');
        updateAllCharts();
    });

    document.getElementById('showRate').addEventListener('click', () => {
        currentDataType = '자살률';
        document.getElementById('showRate').classList.add('bg-blue-500', 'text-white');
        document.getElementById('showRate').classList.remove('bg-gray-200', 'text-gray-700');
        document.getElementById('showCount').classList.add('bg-gray-200', 'text-gray-700');
        document.getElementById('showCount').classList.remove('bg-blue-500', 'text-white');
        updateAllCharts();
    });

    // 각 차트별 컨트롤
    ['chart2Region', 'chart3Region', 'chart3Year'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateAllCharts);
    });
}); 