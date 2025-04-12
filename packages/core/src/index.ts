import { Config } from "../utils/types/config";

let keys: string[] = [];
let table = document.createElement("table");
let container: any;
let origionalValue: any[];
let filteredValue: any[];
let configData: Config;

const includeCSSFile = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "./../assets/css/index.css"; // Adjust the path as necessary
  document.head.appendChild(link);
};

function intiTableConfig() {
  table.style.tableLayout = "fixed";
  table.style.width = "100%";
  const colGroup = document.createElement("colgroup");
  keys.forEach(() => {
    const col = document.createElement("col");
    col.style.width = `${100 / keys.length}%`; // Set equal width for each column
    colGroup.appendChild(col);
  });
  table.appendChild(colGroup);
  table.className = "sortable-table";
}

function initTableHeader(keys: string[]) {
  const headerRow = document.createElement("tr");
  keys.forEach((key) => {
    const th = document.createElement("th");
    th.className = "sortable";
    th.className = "text-center";
    th.textContent = key.toUpperCase();
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);
}

function initTableData(data: any[]) {
  data.forEach((row) => {
    const tr = document.createElement("tr");
    Object.values(row).forEach((value) => {
      const td = document.createElement("td");
      td.className = "text-center";
      td.textContent = value as string;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function resetSortingOrder() {
  const headers = table.querySelectorAll("th");
  headers.forEach((header) => {
    header.dataset.sortOrder = "";
    header.innerText = header.innerText.replace(" ▲", "").replace(" ▼", "");
  });
}

function sortData(data: any[], i: number, sortOrder: "asc" | "desc") {
  resetSortingOrder();
  const headers = table.querySelectorAll("th");
  headers[i].dataset.sortOrder = sortOrder;
  const iconContainer = document.createElement("span");
  iconContainer.style.marginLeft = "5px";
  iconContainer.style.display = "inline-block";
  iconContainer.style.width = "10px";
  iconContainer.style.height = "10px";
  iconContainer.innerHTML =
    sortOrder === "asc"
      ? `<svg viewBox="0 0 407.436 407.436"><polygon points="203.718,91.567 0,294.621 21.179,315.869 203.718,133.924 386.258,315.869 407.436,294.621"/></svg>`
      : `<svg viewBox="0 0 407.437 407.437"><polygon points="386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815"/></svg>`;
  headers[i].appendChild(iconContainer);
  headers[i].className = "text-center";
  return data.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[keys[i]] > b[keys[i]] ? 1 : -1;
    } else {
      return a[keys[i]] < b[keys[i]] ? 1 : -1;
    }
  });
}

function attachSortingFunctionality(data: any[]) {
  const headers = table.querySelectorAll("th");
  for (let i = 0; i < keys.length; i++) {
    headers[i].addEventListener("click", () => {
      const sortOrder = headers[i].dataset.sortOrder === "asc" ? "desc" : "asc";
      headers[i].dataset.sortOrder = sortOrder;
      const sortedData = sortData(data, i, sortOrder);

      // Clear existing rows except headers
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }

      // Add sorted rows
      sortedData.forEach((row) => {
        const tr = document.createElement("tr");
        tr.className = "text-center";
        Object.values(row).forEach((value) => {
          const td = document.createElement("td");
          td.textContent = value as string;
          tr.appendChild(td);
        });
        table.appendChild(tr);
      });
    });
  }
}

function initializeFilterOption() {
  const filterInput = document.createElement("input");
  filterInput.type = "text";
  filterInput.placeholder = "Filter...";
  filterInput.className = "filter-input";
  container.insertBefore(filterInput, table);

  let debounceTimer: NodeJS.Timeout;
  filterInput.addEventListener("input", (event: Event) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const value = (event.target as HTMLInputElement).value
        .trim()
        .toLowerCase();
      filteredValue = value
        ? origionalValue.filter((row) =>
            Object.values(row).some((cell) =>
              String(cell).toLowerCase().includes(value)
            )
          )
        : origionalValue;

      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      if (filteredValue.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = keys.length;
        td.textContent = "No items found";
        td.className = "text-center";
        tr.appendChild(td);
        table.appendChild(tr);
      } else {
        initTableData(filteredValue);
      }
      resetSortingOrder();
    }, 300);
  });
}

export const init = ({
  data,
  config,
}: {
  data: any[];
  config?: { includeSortings: boolean; includeFilter: boolean };
}) => {
  origionalValue = data;
  filteredValue = data;
  keys = Object.keys(data[0]);
  if (config) {
    configData = config;
  }
  includeCSSFile();
  intiTableConfig();
  initTableHeader(keys);
  initTableData(data);
  if (configData?.includeSortings) {
    attachSortingFunctionality(data);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("sortable-table");
  if (!container) throw new Error("Element with id 'sortable-table' not found");
  container.appendChild(table);
  if (configData?.includeFilter) {
    initializeFilterOption();
  }
});
