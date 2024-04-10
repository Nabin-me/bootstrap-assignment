// this js file fetches data from data/data.json and renders it on the page
document.addEventListener("DOMContentLoaded", function () {
  const profileDataContainer = document.getElementById("profileDataContainer");
  const topCardContainer = document.getElementById("topCardContainer");
  const graphContainer = document.getElementById("graphContainer");
  const bottomCardsContainer = document.getElementById("bottomCardsContainer");

  // get json
  async function getJsonData() {
    try {
      const response = await fetch("data/data.json");
      const jsonData = await response.json();

      // Render the profile data
      renderUserData(jsonData.user);
      // Render the cards
      renderTopCards(jsonData.cards);
      // Render the graph area
      renderGraphInfo(jsonData.graph, jsonData.graph_data, jsonData.options);
      // Render the tickets & tasks
      renderTickets(jsonData.tickets);
      renderTasks(jsonData.tasks);
    } catch (err) {
      console.log("error:", err);
    }
  }
  getJsonData();

  function renderUserData(userData) {
    const userFullName = document.createElement("span");
    userFullName.classList.add(
      "mx-2",
      "fw-semibold",
      "d-none",
      "d-sm-inline-block"
    );
    userFullName.textContent = `${userData.first_name} ${userData.last_name}`;

    const profilePhotoLink = document.createElement("a");
    profilePhotoLink.href = "#";

    const profilePhoto = document.createElement("img");
    profilePhoto.classList.add("rounded-circle", "p-1", "border", "avatar");
    profilePhoto.src = userData.avatarURL;
    profilePhoto.alt = `Profile photo of ${userData.first_name}`;

    profilePhotoLink.appendChild(profilePhoto);

    profileDataContainer.appendChild(userFullName);
    profileDataContainer.appendChild(profilePhotoLink);
  }
  function renderTopCards(cardsData) {
    const cards = []; // empty array to store the cards
    cardsData.forEach((cardData) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.classList.add("col");

      const innerCard = document.createElement("div");
      innerCard.classList.add(
        "card",
        "text-center",
        "bg-white",
        "cursor-pointer",
        "toggle-cards"
      );

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body", "toggle-cards");
      cardBody.addEventListener("click", function () {
        toggleActive(cards, innerCard);
      });

      const title = document.createElement("h6");
      title.classList.add("card-title", "fw-bold", "text-secondary");
      title.textContent = cardData.title;

      const value = document.createElement("h1");
      value.classList.add("fw-bold");
      value.textContent = cardData.count;

      cardBody.appendChild(title);
      cardBody.appendChild(value);
      innerCard.appendChild(cardBody);
      cardWrapper.appendChild(innerCard);
      topCardContainer.appendChild(cardWrapper);

      cards.push(innerCard);
    });
  }
  function toggleActive(cards, card) {
    cards.forEach(function (otherCard) {
      otherCard.classList.remove("border-primary", "text-primary");
      otherCard.querySelector("h6").classList.add("text-secondary");
    });
    card.classList.add("border-primary", "text-primary");
    card.querySelector("h6").classList.toggle("text-secondary");
  }

  function renderGraphInfo(graphInfo, graphData, chartOptions) {
    const areaWrapper = document.createElement("div");
    areaWrapper.classList.add("col-lg-8", "px-3");

    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add("pt-4");

    const title = document.createElement("h5");
    title.classList.add("fw-bold");
    title.textContent = `${graphInfo.day} 's trends`;

    const subtitle = document.createElement("p");
    subtitle.classList.add("text-secondary");
    subtitle.textContent = `as of ${graphInfo.timestamp}`;

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(subtitle);
    areaWrapper.appendChild(titleWrapper);

    function createGraphCanvas() {
      return new Promise((resolve, reject) => {
        const graphCanvas = document.createElement("div");
        graphCanvas.classList.add("chart");
        areaWrapper.appendChild(graphCanvas);

        resolve(graphCanvas);
      });
    }
    createGraphCanvas().then((graphCanvas) => {
      renderGraph(chartOptions);
    });

    graphContainer.appendChild(areaWrapper);
    renderGraphData(graphData);
  }
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
    const graphDataContainer = document.createElement("div");
    graphDataContainer.classList.add(
      "col-lg-4",
      "px-3",
      "border-lg-start",
      "vstack",
      "justify-content-center"
    );
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

    graphContainer.appendChild(graphDataContainer);
  }

  // function to render Unresolved Tickets section
  function renderTickets(tickets) {
    const ticketSection = document.createElement("section");
    ticketSection.classList.add("col-md-6", "mb-4");

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("pt-4", "bg-white", "rounded", "border");

    const cardTitleWrapper = document.createElement("div");
    cardTitleWrapper.classList.add("p-3");

    const titleSection = document.createElement("section");
    titleSection.classList.add("hstack", "justify-content-between");

    const title = document.createElement("h5");
    title.classList.add("fw-bold");
    title.textContent = tickets.status + " Tickets";

    const button = document.createElement("button");
    button.classList.add("btn", "btn-sm", "text-primary", "p-0", "fw-bold");
    button.textContent = "View details";

    titleSection.appendChild(title);
    titleSection.appendChild(button);
    cardTitleWrapper.appendChild(titleSection);

    const groupTextWrapper = document.createElement("span");
    groupTextWrapper.classList.add("text-muted", "fs-xs");
    groupTextWrapper.textContent = "Group:";

    const groupText = document.createElement("span");
    groupText.classList.add("text-dark", "fw-semibold");
    groupText.textContent = tickets.group;

    groupTextWrapper.appendChild(groupText);
    cardTitleWrapper.appendChild(groupTextWrapper);

    cardWrapper.appendChild(cardTitleWrapper);

    tickets.categories.forEach((category, index) => {
      const cardContentWrapper = document.createElement("div");
      cardContentWrapper.classList.add(
        "hstack",
        "px-3",
        "justify-content-between",
        "mt-3",
        "mb-3"
      );

      const categoryTitle = document.createElement("span");
      categoryTitle.classList.add("fw-semibold", "text-dark");
      categoryTitle.textContent = category.title;

      const categoryCount = document.createElement("span");
      categoryCount.classList.add("fw-semibold", "text-secondary");
      categoryCount.textContent = category.count;

      cardContentWrapper.appendChild(categoryTitle);
      cardContentWrapper.appendChild(categoryCount);

      cardWrapper.appendChild(cardContentWrapper);

      // Add divider if not the last category
      if (index < tickets.categories.length - 1) {
        const divider = document.createElement("hr");
        cardWrapper.appendChild(divider);
      }
    });
    ticketSection.appendChild(cardWrapper);
    bottomCardsContainer.appendChild(ticketSection);
  }

  function renderTasks(tasks) {
    const taskSection = document.createElement("section");
    taskSection.classList.add("col-md-6", "mb-4");

    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("pt-4", "bg-white", "rounded", "border");

    const cardTitleWrapper = document.createElement("div");
    cardTitleWrapper.classList.add("p-3");

    const titleSection = document.createElement("section");
    titleSection.classList.add("hstack", "justify-content-between");

    const title = document.createElement("h5");
    title.classList.add("fw-bold");
    title.textContent = "Tasks";

    const button = document.createElement("button");
    button.classList.add("btn", "btn-sm", "text-primary", "p-0", "fw-bold");
    button.textContent = "View all";

    titleSection.appendChild(title);
    titleSection.appendChild(button);
    cardTitleWrapper.appendChild(titleSection);

    const TimeTextWrapper = document.createElement("span");
    TimeTextWrapper.classList.add("text-muted", "fs-xs");
    TimeTextWrapper.textContent = tasks.day;

    cardTitleWrapper.appendChild(TimeTextWrapper);

    const cardContentWrapper = document.createElement("div");
    cardContentWrapper.classList.add(
      "hstack",
      "px-3",
      "my-3",
      "justify-content-between"
    );

    const newTaskTitle = document.createElement("span");
    newTaskTitle.classList.add("fw-semibold", "text-muted");
    newTaskTitle.textContent = "Create new task";

    const newTaskBtn = document.createElement("div");
    newTaskBtn.classList.add("btn", "p-0");
    newTaskBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="8" fill="#F0F1F7" />
              <path d="M12 7V17" stroke="#9FA2B4" stroke-width="2" stroke-linecap="round" />
              <path d="M17 12L7 12" stroke="#9FA2B4" stroke-width="2" stroke-linecap="round" />
            </svg>

    `;

    cardContentWrapper.appendChild(newTaskTitle);
    cardContentWrapper.appendChild(newTaskBtn);

    cardWrapper.appendChild(cardTitleWrapper);
    cardWrapper.appendChild(cardContentWrapper);
    const divider = document.createElement("hr");
    cardWrapper.appendChild(divider);
    tasks.tasklist.forEach((taskItem, index) => {
      const cardContentWrapper = document.createElement("div");
      cardContentWrapper.classList.add(
        "hstack",
        "px-3",
        "my-3",
        "justify-content-between"
      );

      const taskTitleWithTick = document.createElement("div");
      taskTitleWithTick.classList.add(
        "form-check",
        "hstack",
        "gap-3",
        "align-items-center"
      );

      const taskTick = document.createElement("input");
      taskTick.classList.add("form-check-input", "rounded-circle");
      taskTick.setAttribute("type", "checkbox");
      taskTick.setAttribute("id", `taskItem-${index}`);
      if (tasks.tasklist.length - 1 == index) {
        taskTick.setAttribute("checked", "");
      }

      const taskTitle = document.createElement("label");
      taskTitle.classList.add(
        "form-check-label",
        "fw-semibold",
        "cursor-pointer"
      );
      taskTitle.setAttribute("for", `taskItem-${index}`);
      taskTitle.textContent = taskItem.task;

      taskTitleWithTick.appendChild(taskTick);
      taskTitleWithTick.appendChild(taskTitle);

      const taskStatus = document.createElement("span");
      if (taskItem.status == "DEFAULT") {
        taskStatus.classList.add("badge", "default-status");
      } else if (taskItem.status == "URGENT") {
        taskStatus.classList.add("badge", "bg-warning", "text-white");
      } else if (taskItem.status == "NEW") {
        taskStatus.classList.add("badge", "bg-success", "text-white");
      }
      taskStatus.textContent = taskItem.status;

      cardContentWrapper.appendChild(taskTitleWithTick);
      cardContentWrapper.appendChild(taskStatus);
      cardWrapper.appendChild(cardContentWrapper);
      // view hr if it is not the last item
      if (tasks.tasklist.length - 1 != index) {
        const divider = document.createElement("hr");
        cardWrapper.appendChild(divider);
      }
    });

    taskSection.appendChild(cardWrapper);
    bottomCardsContainer.appendChild(taskSection);
  }
});
