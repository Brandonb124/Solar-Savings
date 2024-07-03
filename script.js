let electricityCosts = [];
let solarCosts = [];

function calculateSavings() {
    const initialMonthlyElectricityCost = parseFloat(document.getElementById('initialMonthlyElectricityCost').value);
    const initialMonthlySolarCost = parseFloat(document.getElementById('initialMonthlySolarCost').value);
    const years = parseInt(document.getElementById('years').value);
    const solarIncreaseRate = parseFloat(document.getElementById('solarIncrease').value);

    let monthlyElectricityCost = initialMonthlyElectricityCost;
    let monthlySolarCost = initialMonthlySolarCost;

    electricityCosts = [];
    solarCosts = [];
    let labels = [];

    for (let i = 0; i < years; i++) {
        electricityCosts.push(parseFloat(monthlyElectricityCost.toFixed(2)));
        solarCosts.push(parseFloat(monthlySolarCost.toFixed(2)));
        labels.push(`Year ${i + 1}`);

        monthlyElectricityCost *= 1.06;  // Increase electricity cost by 6% annually
        monthlySolarCost *= (1 + solarIncreaseRate);  // Increase solar cost by selected rate annually
    }

    const totalElectricityCost = electricityCosts.reduce((a, b) => a + b, 0) * 12;
    const totalSolarCost = solarCosts.reduce((a, b) => a + b, 0) * 12;
    const savings = totalElectricityCost - totalSolarCost;

    document.getElementById('results').innerHTML = `
        <p>The Cost of Doing Nothing over ${years} years: $${totalElectricityCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Total Solar Cost over ${years} years: $${totalSolarCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Total Savings: $${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;

    const ctx = document.getElementById('costChart').getContext('2d');
    if (window.costChart) {
        window.costChart.destroy();
    }
    window.costChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Monthly Electricity Cost',
                    data: electricityCosts,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Monthly Solar Cost',
                    data: solarCosts,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false,
                    tension: 0.1
                },
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Monthly Cost ($)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += `$${parseFloat(context.raw).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                            return label;
                        }
                    }
                }
            }
        }
    });

    document.getElementById('yearSlider').max = years;
    document.getElementById('yearSlider').value = 1;
    updateYearlyCosts();
}

function updateYearlyCosts() {
    const year = parseInt(document.getElementById('yearSlider').value);
    document.getElementById('selectedYear').innerText = year;

    const electricityCost = electricityCosts[year - 1];
    const solarCost = solarCosts[year - 1];
    const monthlyDifference = electricityCost - solarCost;
    const annualDifference = monthlyDifference * 12;

    document.getElementById('yearlyCosts').innerHTML = `
        <div class="card">
            <p><i class="fas fa-calendar-alt"></i> Year: ${year}</p>
            <p><i class="fas fa-bolt"></i> Monthly Electricity Cost: $${electricityCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><i class="fas fa-solar-panel"></i> Monthly Solar Cost: $${solarCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><i class="fas fa-exchange-alt"></i> Monthly Difference: $${monthlyDifference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p><i class="fas fa-calendar-check"></i> Annual Difference: $${annualDifference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
    `;
}

// Initialize a global variable for the chart instance
window.costChart = null;