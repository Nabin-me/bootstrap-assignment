




// JavaScript to handle sidebar toggling
document.addEventListener('DOMContentLoaded', function () {
    const sidebarLinks = document.querySelectorAll('.nav-link');
    const cards = document.querySelectorAll('.toggle-cards');
    const dataContainer = document.getElementById("dataContainer");

    async function getJsonData() {
       try{
        const response = await fetch('data/data.json');
        const jsonData = await response.json();
        console.log(jsonData);

        // Render the top info cards
        jsonData.graph_data.forEach(item => {
            const row = document.createElement("div");
            row.classList.add("row");
    
            const col = document.createElement("div");
            col.classList.add("col", "border-bottom", "p-4");
    
            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body", "d-flex", "flex-column", "justify-content-center", "align-items-center");
    
            const title = document.createElement("h6");
            title.classList.add("card-title", "fw-bold", "text-secondary");
            title.textContent = item.title;
    
            const value = document.createElement("h4");
            value.classList.add("fw-bold");
            value.textContent = item.count || item.value || item.percentage;
    
            cardBody.appendChild(title);
            cardBody.appendChild(value);
            col.appendChild(cardBody);
            row.appendChild(col);
            dataContainer.appendChild(row);
          });

       }
         catch(err){
              console.log('error:', err);
         }
    }
   getJsonData();

    // Add active class to clicked sidebar link
    sidebarLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            sidebarLinks.forEach(function (otherLink) {
                otherLink.classList.remove('active');
            });
            link.classList.add('active');
        })


    })

    // Add active class to clicked card
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            toggleActive(card);
        });

    });
    function toggleActive(card) {
        cards.forEach(function (otherCard) {
            otherCard.classList.remove('border-primary', 'text-primary');
            card.querySelector('h6').classList.add('text-secondary');
        })
        card.classList.add('border-primary', 'text-primary');
        card.querySelector('h6').classList.toggle('text-secondary');
    }


    // Render apex chart
    const options = {
        series: [{
            name: "Today",
            data: [{
                x: 0,
                y: 12
            }, {
                x: 3,
                y: 30
            }, {
                x: 5,
                y: 28
            }, {
                x: 8,
                y: 50
            }, {
                x: 11,
                y: 18
            }, {
                x: 14.5,
                y: 38
            },
            {
                x: 16,
                y: 47
            },
            {
                x: 19,
                y: 38
            },
            ],
        },
        {
            name: 'Yesterday',
            data: [{
                x: 0,
                y: 35
            }, {
                x: 5,
                y: 20
            }, {
                x: 8,
                y: 32
            }, {
                x: 13,
                y: 18
            }, {
                x: 15.5,
                y: 37
            },
            {
                x: 16.5,
                y: 29.5
            },
            {
                x: 19,
                y: 33
            },
            ],


        }
        ],
        chart: {
            type: "area",
            toolbar: {
                show: false,
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
            }

        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: "numeric",
            min: 0,
            max: 22,
            tickAmount: 23,
            labels: {
                formatter: function (val) {
                    return Math.round(val);
                }
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            min: 0,
            max: 60,
            opposite: true,
            labels: {
                formatter: function (val) {
                    return Math.round(val);
                }
            },
        },
        stroke: {
            curve: "smooth",
            width: 2
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: .15,
                opacityTo: 0,
                stops: [0, 90, 100],
                type: "horizontal",
            }
        },
        colors: ["var(--bs-primary)", "var(--bs-gray-300)"],

        tooltip: {
            theme: "dark",
            x: {
                show: false
            },
            y: {
                title: {
                    formatter: function () {
                        return '';
                    }
                }
            },


        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
            markers: {
                customHTML: [
                    function () {
                        // wrap the rect in a svg 
                        return '<rect x="0" y="0" width="10" height="5" rx="2" ry="2" style="fill: var(--bs-primary);"/>'
                    },
                    function () {
                        return '<rect x="0" y="0" width="10" height="5" rx="2" ry="2" style="fill: var(--bs-gray-300);"/>'
                    }
                ],
                width: 16,
                height: 3,
                offsetY: -3
            }
        }

    };
    const chart = new ApexCharts(document.querySelector(".chart"), options);
    chart.render();
});

