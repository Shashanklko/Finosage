/**
 * Portfolio Result Page - Main Entry Point
 * 
 * This file loads portfolio data from localStorage and displays
 * it using charts and metrics calculations.
 */

// Import modules
import {
    initAssetAllocationChart,
    initProjectedValueChart,
    initRiskProfileChart,
    initSectorAllocationChart
} from './portfolio-result/charts.js';
import { updateUI } from './portfolio-result/dom.js';
import { calculateMetrics } from './portfolio-result/metrics.js';
import { createFAQMarkup, createTermsMarkup } from './portfolio-result/mutual-funds-qa.js';

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load portfolio data from localStorage
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData'));
    
    // Redirect if no data found
    if (!portfolioData) {
        showErrorState();
        return;
    }
    
    try {
        // Extract data components
        const { userInputs, allocation } = portfolioData;
        
        // Calculate all portfolio metrics
        const metrics = calculateMetrics(userInputs, allocation);
        
        // Initialize all charts
        const charts = {
            allocation: initAssetAllocationChart(allocation),
            risk: initRiskProfileChart(metrics.riskScore),
            projectedValue: initProjectedValueChart(userInputs.initialInvestment, metrics.expectedReturn),
            sectors: initSectorAllocationChart() // Using default sectors for now
        };
        
        // Update all UI elements
        updateUI(userInputs, allocation, metrics);
        
        // Initialize download report button
        initializeDownloadReport(userInputs, allocation, metrics);
        
        // Initialize returns calculator
        initializeReturnsCalculator(metrics.expectedReturn);
        
        // Initialize Edit Portfolio button
        initializeEditPortfolioButton();
        
        // Initialize mutual fund Q&A section
        initializeMutualFundQA();
        
        // Initialize portfolio visualization
        initializePortfolioVisualization({ userInputs, allocation, metrics });
        
        // Initialize market data
        initializeMarketData();
        
    } catch (error) {
        console.error('Error rendering portfolio results:', error);
        showErrorState();
    }
});

/**
 * Shows error state when portfolio data is missing or invalid
 */
function showErrorState() {
    alert('No portfolio data found or data is invalid. Redirecting to builder...');
    window.location.href = 'portfolio-builder.html';
}

/**
 * Initializes the download report button functionality
 * @param {Object} userInputs - User preferences and demographics
 * @param {Object} allocation - Portfolio allocation percentages
 * @param {Object} metrics - Calculated portfolio metrics
 */
function initializeDownloadReport(userInputs, allocation, metrics) {
    const downloadButton = document.querySelector('.btn-download');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            // Using the global jsPDF from the CDN
            const { jsPDF } = window.jspdf;
            
            if (typeof jsPDF === 'function') {
                try {
                    const doc = new jsPDF();
                    
                    // Add report content
                    doc.setFontSize(22);
                    doc.text('Portfolio Analysis Report', 105, 20, { align: 'center' });
                    
                    doc.setFontSize(14);
                    doc.text('Portfolio Allocation', 20, 40);
                    
                    // Add allocation data
                    let yPos = 50;
                    Object.entries(allocation).forEach(([asset, value]) => {
                        doc.setFontSize(12);
                        doc.text(`${asset.charAt(0).toUpperCase() + asset.slice(1)}: ${value}%`, 30, yPos);
                        yPos += 10;
                    });
                    
                    // Add metrics
                    yPos += 10;
                    doc.setFontSize(14);
                    doc.text('Portfolio Metrics', 20, yPos);
                    yPos += 10;
                    
                    doc.setFontSize(12);
                    doc.text(`Expected Annual Return: ${metrics.expectedReturn}%`, 30, yPos);
                    yPos += 10;
                    doc.text(`Risk Level: ${metrics.riskScore}/10`, 30, yPos);
                    yPos += 10;
                    doc.text(`Volatility: ${metrics.volatility}%`, 30, yPos);
                    
                    // Save PDF
                    doc.save('portfolio-report.pdf');
                    
                } catch (error) {
                    console.error('Error generating PDF:', error);
                    alert('Failed to generate PDF report. Please try again later.');
                }
            } else {
                alert('PDF generation is not available. Please try again later.');
                }
            });
        }
    }
    
/**
 * Initializes the returns calculator functionality
 * @param {number} expectedReturn - Expected annual return percentage
 */
function initializeReturnsCalculator(expectedReturn) {
    // Get calculator elements
    const calculatorTabs = document.querySelectorAll('.calculator-tab');
    const investmentAmountInput = document.getElementById('investmentAmount');
    const investmentYearsInput = document.getElementById('investmentYears');
    const projectedValueElement = document.querySelector('.projected-value');
    
    // Calculator mode (lump sum or SIP)
    let isLumpSum = true;
    
    // Add event listeners to calculator tabs
    calculatorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            calculatorTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Set calculator mode
            isLumpSum = this.textContent.trim() === 'Lump Sum';
            
            // Update labels based on mode
            if (isLumpSum) {
                document.querySelector('label[for="investmentAmount"]').textContent = 'Investment Amount';
            } else {
                document.querySelector('label[for="investmentAmount"]').textContent = 'Monthly SIP Amount';
            }
            
            // Recalculate with current values
            calculateReturns();
        });
    });
    
    // Add event listeners to inputs
    investmentAmountInput.addEventListener('input', calculateReturns);
    investmentYearsInput.addEventListener('input', calculateReturns);
    
    // Function to calculate returns based on inputs
    function calculateReturns() {
        const amount = parseFloat(investmentAmountInput.value) || 0;
        const years = parseFloat(investmentYearsInput.value) || 0;
        const monthlyRate = expectedReturn / 100 / 12;
        const months = years * 12;
        
        let projectedValue = 0;
        
        if (isLumpSum) {
            // Lump sum calculation: P * (1 + r)^t
            projectedValue = amount * Math.pow(1 + expectedReturn / 100, years);
        } else {
            // SIP calculation: P * ((1 + r)^n - 1) / r * (1 + r)
            projectedValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        }
        
        // Format and display the result
        projectedValueElement.textContent = '₹' + projectedValue.toLocaleString('en-IN', {
            maximumFractionDigits: 0
        });
    }
    
    // Initialize with default values
    calculateReturns();
}

/**
 * Initializes the Edit Portfolio button
 */
function initializeEditPortfolioButton() {
    const editButton = document.querySelector('.btn-edit');
    
    if (editButton) {
        editButton.addEventListener('click', function() {
            window.location.href = 'portfolio-builder.html';
        });
    }
}

/**
 * Initializes the mutual fund Q&A section
 */
function initializeMutualFundQA() {
    // Load content into tabs
    const faqContent = document.getElementById('faq-content');
    const termsContent = document.getElementById('terms-content');
    
    if (faqContent && termsContent) {
        // Replace loading placeholders with content
        faqContent.innerHTML = createFAQMarkup();
        termsContent.innerHTML = createTermsMarkup();
        
        // Add tab switching functionality
        const tabs = document.querySelectorAll('.qa-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                document.querySelectorAll('.qa-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
        
        // Add accordion functionality for FAQs
        const qaItems = document.querySelectorAll('.qa-item');
        qaItems.forEach(item => {
            const question = item.querySelector('.qa-question');
            question.addEventListener('click', function() {
                // Toggle active state
                item.classList.toggle('active');
            });
        });
    }
}

// Initialize portfolio visualization
function initializePortfolioVisualization({ userInputs, allocation, metrics }) {
    // Implementation of initializePortfolioVisualization function
}

// Initialize market data
function initializeMarketData() {
    // Implementation of initializeMarketData function
} 