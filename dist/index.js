var keys = [];
var table = document.createElement("table");
var container;
var origionalValue;
var filteredValue;
var configData;
var includeCSSFile = function () {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "./../assets/css/index.css";
    document.head.appendChild(link);
};
function intiTableConfig() {
    table.style.tableLayout = "fixed";
    table.style.width = "100%";
    var colGroup = document.createElement("colgroup");
    keys.forEach(function () {
        var col = document.createElement("col");
        col.style.width = "".concat(100 / keys.length, "%");
        colGroup.appendChild(col);
    });
    table.appendChild(colGroup);
    table.className = "sortable-table";
}
function initTableHeader(keys) {
    var headerRow = document.createElement("tr");
    keys.forEach(function (key) {
        var th = document.createElement("th");
        th.className = "sortable";
        th.className = "text-center";
        th.textContent = key.toUpperCase();
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
}
function initTableData(data) {
    data.forEach(function (row) {
        var tr = document.createElement("tr");
        Object.values(row).forEach(function (value) {
            var td = document.createElement("td");
            td.className = "text-center";
            td.textContent = value;
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}
function resetSortingOrder() {
    var headers = table.querySelectorAll("th");
    headers.forEach(function (header) {
        header.dataset.sortOrder = "";
        header.innerText = header.innerText.replace(" ▲", "").replace(" ▼", "");
    });
}
function sortData(data, i, sortOrder) {
    resetSortingOrder();
    var headers = table.querySelectorAll("th");
    headers[i].dataset.sortOrder = sortOrder;
    var iconContainer = document.createElement("span");
    iconContainer.style.marginLeft = "5px";
    iconContainer.style.display = "inline-block";
    iconContainer.style.width = "10px";
    iconContainer.style.height = "10px";
    iconContainer.innerHTML =
        sortOrder === "asc"
            ? "<svg viewBox=\"0 0 407.436 407.436\"><polygon points=\"203.718,91.567 0,294.621 21.179,315.869 203.718,133.924 386.258,315.869 407.436,294.621\"/></svg>"
            : "<svg viewBox=\"0 0 407.437 407.437\"><polygon points=\"386.258,91.567 203.718,273.512 21.179,91.567 0,112.815 203.718,315.87 407.437,112.815\"/></svg>";
    headers[i].appendChild(iconContainer);
    headers[i].className = "text-center";
    return data.sort(function (a, b) {
        if (sortOrder === "asc") {
            return a[keys[i]] > b[keys[i]] ? 1 : -1;
        }
        else {
            return a[keys[i]] < b[keys[i]] ? 1 : -1;
        }
    });
}
function attachSortingFunctionality(data) {
    var headers = table.querySelectorAll("th");
    var _loop_1 = function (i) {
        headers[i].addEventListener("click", function () {
            var sortOrder = headers[i].dataset.sortOrder === "asc" ? "desc" : "asc";
            headers[i].dataset.sortOrder = sortOrder;
            var sortedData = sortData(data, i, sortOrder);
            // Clear existing rows except headers
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            // Add sorted rows
            sortedData.forEach(function (row) {
                var tr = document.createElement("tr");
                tr.className = "text-center";
                Object.values(row).forEach(function (value) {
                    var td = document.createElement("td");
                    td.textContent = value;
                    tr.appendChild(td);
                });
                table.appendChild(tr);
            });
        });
    };
    for (var i = 0; i < keys.length; i++) {
        _loop_1(i);
    }
}
function initializeFilterOption() {
    var filterInput = document.createElement("input");
    filterInput.type = "text";
    filterInput.placeholder = "Filter...";
    filterInput.className = "filter-input";
    container.insertBefore(filterInput, table);
    var debounceTimer;
    filterInput.addEventListener("input", function (event) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            var value = event.target.value
                .trim()
                .toLowerCase();
            filteredValue = value
                ? origionalValue.filter(function (row) {
                    return Object.values(row).some(function (cell) {
                        return String(cell).toLowerCase().includes(value);
                    });
                })
                : origionalValue;
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }
            if (filteredValue.length === 0) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.colSpan = keys.length;
                td.textContent = "No items found";
                td.className = "text-center";
                tr.appendChild(td);
                table.appendChild(tr);
            }
            else {
                initTableData(filteredValue);
            }
            resetSortingOrder();
        }, 300);
    });
}
var init = function (_a) {
    var data = _a.data, config = _a.config;
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
    if (configData === null || configData === void 0 ? void 0 : configData.includeSortings) {
        attachSortingFunctionality(data);
    }
};
document.addEventListener("DOMContentLoaded", function () {
    container = document.getElementById("sortable-table");
    if (!container)
        throw new Error("Element with id 'sortable-table' not found");
    container.appendChild(table);
    if (configData === null || configData === void 0 ? void 0 : configData.includeFilter) {
        initializeFilterOption();
    }
});

export { init as default };
//# sourceMappingURL=index.js.map
