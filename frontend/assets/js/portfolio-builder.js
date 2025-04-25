document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('portfolioBuilderForm');
    const sections = document.querySelectorAll('.form-section');
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const submitBtn = document.querySelector('.btn-submit');
    
    let currentStep = 1;
    const totalSteps = sections.length;

    // Update form navigation
    function updateNavigation() {
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else if (index + 1 < currentStep) {
                step.classList.add('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        prevBtn.disabled = currentStep === 1;
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // Show current section
    function showSection(step) {
        sections.forEach((section, index) => {
            if (index + 1 === step) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    // Validate current section
    function validateCurrentSection(step) {
        switch(step) {
            case 1:
                const age = parseInt(document.getElementById('age').value);
                const investment = parseInt(document.getElementById('initialInvestment').value);
                const horizon = document.getElementById('investmentHorizon').value;

                if (!age || isNaN(age) || age < 18 || age > 100) {
                    alert('Please enter a valid age between 18 and 100');
                    return false;
                }
                if (!investment || isNaN(investment) || investment < 5000 || investment > 10000000) {
                    alert('Please enter a valid investment amount between ₹5,000 and ₹1,00,00,000');
                    return false;
                }
                if (!horizon || !['short', 'medium', 'long'].includes(horizon)) {
                    alert('Please select a valid investment horizon');
                    return false;
                }
                break;

            case 2:
                if (!document.querySelector('input[name="riskTolerance"]:checked')) {
                    alert('Please select your risk tolerance');
                    return false;
                }
                break;

            case 3:
                if (!document.querySelector('input[name="investmentGoal"]:checked')) {
                    alert('Please select your investment goal');
                    return false;
                }
                break;

            case 4:
                if (!document.querySelector('input[name="preferences"]:checked')) {
                    alert('Please select at least one investment preference');
                    return false;
                }
                break;
        }
        return true;
    }

    // Handle next button click
    nextBtn.addEventListener('click', () => {
        if (validateCurrentSection(currentStep)) {
            currentStep++;
            showSection(currentStep);
            updateNavigation();
        }
    });

    // Handle previous button click
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            showSection(currentStep);
            updateNavigation();
        }
    });

    // Handle risk slider
    const riskSlider = document.getElementById('riskSlider');
    if (riskSlider) {
        riskSlider.addEventListener('input', function() {
            const value = this.value;
            let riskLevel = 'moderate';
            if (value <= 3) riskLevel = 'conservative';
            else if (value >= 7) riskLevel = 'aggressive';
            
            document.querySelector(`input[name="riskTolerance"][value="${riskLevel}"]`).checked = true;
        });
    }

    // Generate portfolio allocation
    function generatePortfolio(formData) {
        const { age, riskTolerance, investmentHorizon, preferences, investmentGoal } = formData;
        
        // Base allocations based on risk tolerance
        let equityBase = {
            'conservative': 40,
            'moderate': 60,
            'aggressive': 80
        }[riskTolerance];

        // Adjust for age (reduce equity as age increases)
        const ageAdjustment = Math.max(0, (age - 30) * 0.5);
        equityBase = Math.max(20, equityBase - ageAdjustment);

        // Adjust for investment horizon
        const horizonAdjustment = {
            'short': -10,
            'medium': 0,
            'long': 10
        }[investmentHorizon];
        equityBase += horizonAdjustment;

        // Adjust for investment goal
        if (investmentGoal === 'growth') equityBase += 5;
        if (investmentGoal === 'income') equityBase -= 5;

        // Ensure equity base stays within reasonable limits
        equityBase = Math.min(90, Math.max(20, equityBase));

        // Initialize allocation with more sophisticated distribution
        const allocation = {};
        
        if (preferences.includes('stocks')) {
            allocation.stocks = Math.round(equityBase * (riskTolerance === 'aggressive' ? 0.7 : 0.6));
        }
        if (preferences.includes('etfs')) {
            allocation.etfs = Math.round(equityBase * (riskTolerance === 'conservative' ? 0.5 : 0.4));
        }
        if (preferences.includes('mutual-funds')) {
            allocation['mutual-funds'] = Math.round(equityBase * (riskTolerance === 'conservative' ? 0.6 : 0.5));
        }
        if (preferences.includes('bonds')) {
            allocation.bonds = Math.round((100 - equityBase) * (riskTolerance === 'conservative' ? 0.9 : 0.8));
        }
        if (preferences.includes('crypto')) {
            allocation.crypto = Math.min(
                riskTolerance === 'aggressive' ? 15 : 10,
                Math.round(equityBase * (riskTolerance === 'aggressive' ? 0.15 : 0.1))
            );
        }

        // Add cash for remaining allocation
        const totalAllocation = Object.values(allocation).reduce((a, b) => a + b, 0);
        if (totalAllocation < 100) {
            allocation.cash = 100 - totalAllocation;
        }

        // Normalize allocations to ensure they sum to 100%
        const total = Object.values(allocation).reduce((a, b) => a + b, 0);
        if (total !== 100) {
            Object.keys(allocation).forEach(key => {
                allocation[key] = Math.round((allocation[key] / total) * 100);
            });
        }

        return allocation;
    }

    // Calculate portfolio metrics
    function calculateMetrics(allocation, formData) {
        // Expected returns for each asset class
        const returns = {
            stocks: 12,
            etfs: 10,
            bonds: 6,
            'mutual-funds': 11,
            crypto: 20,
            cash: 3
        };

        // Calculate expected return
        const expectedReturn = Object.entries(allocation).reduce((total, [asset, percentage]) => {
            return total + (percentage * returns[asset] / 100);
        }, 0);

        // Calculate risk score
        const riskScores = {
            stocks: 8,
            etfs: 6,
            bonds: 3,
            crypto: 10,
            cash: 1
        };

        const riskScore = Object.entries(allocation).reduce((total, [asset, percentage]) => {
            return total + (percentage * riskScores[asset] / 100);
        }, 0);

        return {
            expectedReturn: expectedReturn.toFixed(2),
            riskScore: riskScore.toFixed(2),
            volatility: (riskScore * 2).toFixed(2),
            timeHorizon: formData.investmentHorizon
        };
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateCurrentSection(currentStep)) {
            return;
        }

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Portfolio...';

            // Collect form data
            const formData = {
                age: parseInt(document.getElementById('age').value),
                initialInvestment: parseInt(document.getElementById('initialInvestment').value),
                investmentHorizon: document.getElementById('investmentHorizon').value,
                riskTolerance: document.querySelector('input[name="riskTolerance"]:checked').value,
                investmentGoal: document.querySelector('input[name="investmentGoal"]:checked').value,
                preferences: Array.from(document.querySelectorAll('input[name="preferences"]:checked')).map(cb => cb.value)
            };

            // Generate portfolio allocation
            const allocation = generatePortfolio(formData);
            
            // Calculate metrics
            const metrics = calculateMetrics(allocation, formData);

            // Store data in localStorage
            const portfolioData = {
                userInputs: formData,
                allocation: allocation,
                metrics: metrics
            };
            localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

            // Redirect to results page
            window.location.href = 'portfolio-result.html';

        } catch (error) {
            console.error('Error generating portfolio:', error);
            alert('An error occurred while generating your portfolio. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Generate Portfolio';
        }
    });

    // Initialize form
    updateNavigation();
    showSection(currentStep);
}); 