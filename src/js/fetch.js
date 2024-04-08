// this js file fetches data from data/data.json and renders it on the page
document.addEventListener("DOMContentLoaded", function () {
  const graphDataContainer = document.getElementById("graphDataContainer");

  async function getJsonData() {
    try {
      const response = await fetch("data/data.json");
      const jsonData = await response.json();
      const chartOptions = jsonData.options;
      // Render the graph
      renderGraph(chartOptions);

      // Render the top info cards
      renderGraphData(jsonData.graph_data);
    } catch (err) {
      console.log("error:", err);
    }
  }
  getJsonData();
  function renderGraph(chartOptions) {
    chartOptions.xaxis.labels.formatter = chartOptions.yaxis.labels.formatter =
      function (val) {
        return Math.round(val);
      };
    chartOptions.tooltip.y.title.formatter = function () {
      return "";
    };
    chartOptions.legend.markers.customHTML = [
      function () {
        return '<rect x="0" y="0" width="10" height="5" rx="2" ry="2" style="fill: var(--bs-primary);"/>';
      },
      function () {
        return '<rect x="0" y="0" width="10" height="5" rx="2" ry="2" style="fill: var(--bs-gray-300);"/>';
      },
    ];
    const chart = new ApexCharts(
      document.querySelector(".chart"),
      chartOptions
    );
    chart.render();
  }
  function renderGraphData(graphData) {
    graphData.forEach((item, index) => {
      const row = document.createElement("div");
      row.classList.add("row");

      const col = document.createElement("div");
      col.classList.add("col", "p-4");
      if (index < graphData.length - 1) {
        col.classList.add("border-bottom");
      }

      const cardBody = document.createElement("div");
      cardBody.classList.add(
        "card-body",
        "d-flex",
        "flex-column",
        "justify-content-center",
        "align-items-center"
      );

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
      graphDataContainer.appendChild(row);
    });
  }
});
