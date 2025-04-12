// Chart initialization functions
import { CHART_COLORS, RISK_LABELS } from './constants.js';

/**
 * Initializes the asset allocation donut chart
 * @param {Object} allocation - Portfolio allocation percentages
 * @returns {Chart} The initialized Chart.js instance
 */
export function initAssetAllocationChart(allocation) {
    const ctx = document.getElementById('assetAllocationChart').getContext('2d');
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(allocation).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
            datasets: [{
                data: Object.values(allocation),
                backgroundColor: CHART_COLORS,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

/**
 * Initializes the risk profile radar chart
 * @param {number} riskScore - User's risk score (1-10)
 * @returns {Chart} The initialized Chart.js instance
 */
export function initRiskProfileChart(riskScore) {
    const ctx = document.getElementById('riskProfileChart').getContext('2d');
    return new Chart(ctx, {
        type: 'radar',
        data: {
            labels: RISK_LABELS,
            datasets: [{
                label: 'Your Risk Profile',
                data: [
                    riskScore * 0.8,  // Market Risk
                    riskScore * 1.2,  // Volatility
                    riskScore * 0.6,  // Liquidity Risk
                    riskScore * 0.9,  // Credit Risk
                    riskScore * 0.7   // Concentration Risk
                ],
                backgroundColor: 'rgba(78, 115, 223, 0.2)',
                borderColor: 'rgba(78, 115, 223, 1)',
                pointBackgroundColor: 'rgba(78, 115, 223, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(78, 115, 223, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });
}

/**
 * Initializes the projected value line chart
 * @param {number} initialInvestment - Starting investment amount
 * @param {number} expectedReturn - Annual expected return percentage
 * @returns {Chart} The initialized Chart.js instance
 */
export function initProjectedValueChart(initialInvestment, expectedReturn) {
    const ctx = document.getElementById('projectedValueChart').getContext('2d');
    
    // Calculate projected values for 10 years
    const projectedValues = calculateProjection(10, initialInvestment, expectedReturn);
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 11}, (_, i) => `Year ${i}`),
            datasets: [{
                label: 'Projected Value',
                data: projectedValues,
                fill: true,
                backgroundColor: 'rgba(78, 115, 223, 0.1)',
                borderColor: 'rgba(78, 115, 223, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '₹' + context.raw.toLocaleString('en-IN');
                        }
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString('en-IN');
                        }
                    }
                }
            }
        }
    });
}

/**
 * Calculates the projected investment values over time
 * @param {number} years - Number of years to project
 * @param {number} initial - Initial investment amount
 * @param {number} rate - Annual return rate (percentage)
 * @returns {Array} Array of projected values for each year
 */
function calculateProjection(years, initial, rate) {
    const data = [];
    for (let i = 0; i <= years; i++) {
        data.push(initial * Math.pow(1 + (rate/100), i));
    }
    return data;
}

/**
 * Initializes the sector allocation chart
 * @param {Object} sectorData - Sector allocation percentages
 * @returns {Chart} The initialized Chart.js instance
 */
export function initSectorAllocationChart(sectorData) {
    const ctx = document.getElementById('sectorAllocationChart').getContext('2d');
    
    // Default sector distribution if none provided
    const defaultSectors = {
        'Technology': 25,
        'Healthcare': 15,
        'Financial': 20,
        'Consumer': 15,
        'Industrial': 15,
        'Others': 10
    };
    
    const sectors = sectorData || defaultSectors;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(sectors),
            datasets: [{
                label: 'Sector Allocation (%)',
                data: Object.values(sectors),
                backgroundColor: CHART_COLORS,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 30
                }
            }
        }
    });
} 