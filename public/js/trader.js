$(document).ready(function() {
    //Global Chart variables so the .destroy() method works when called
    var ctx = $(".myChart");
    myChart = new Chart(ctx, {});

    //Global Chart data variables
    var companyName;
    var companySymbol;
    var companyDates;
    var companyData;
    var newTrader;
    var todayDate = new Date().toISOString().slice(0,10);
    var sellSymbol;
    var sellCompanyName;
    var sellMarket;
    var sellShares;
    var sellBuyDate;
    var sellBuyPrice;
    var sellCurrentPrice;
    var sellNetTotal;

    displayAllUsers();

    //Creates a new User on the DB and reload the page
    $("#userBtn").on("click", function() {
        newTrader = $("#newUser").val();
        $.post("/api/users", {
            username: newTrader
        })//.then(displayNewUser);
        location.reload();
    });

    //Delete User from the DB and reload the page
    $(document).on("click",".deleteUser", function(){
        var id = $(this).val();
        $.ajax({
            method: "DELETE",
            url: "/api/users/" + id
        }).then(
            console.log("Deleted user id: " + id)
        );
        location.reload();
    });

    //Retrieves all stock data from the NYSE table and renders it to the table
    $("#nyseBtn").on("click", function() {
        //$(this).remove();
        $.get("/api/allNyse", function(data) {
            for(var i = 0; i < data.length; i++) {
                var symbol = data[i].symbol;
                var company = data[i].company_name;
                var newTr = $("<tr>");
                newTr.append("<td>" + symbol + "</td>");
                newTr.append("<td>" + company + "</td>");
                newTr.append("<td class='center'><button class='getBtn' value='" + symbol + "'>GET</button></td>")
                $("#nyseTable").append(newTr);
                $(".nyseModal").css("display", "block");
            }
        })
    })
    //Closes the modal
    $(".closeBtn").on("click", function() {
        //Closes the modal that is currently displayed
        $(".nyseModal").css("display", "none");
        $(".nasdaqModal").css("display", "none");
        $(".nyseQueryModal").css("display", "none");
        $(".nasdaqQueryModal").css("display", "none");
        $(".portfolioModal").css("display", "none");
        $(".apiCallModal").css("display", "none");
        $(".stockPurchaseModal").css("display", "none");
        $(".stockSellingModal").css("display", "none");
        //Clears modal tables so they dont repeat
        $("#nyseQueryTable").empty();
        $("#nasdaqQueryTable").empty();
        $("#nasdaqTable").empty();
        $("#nyseTable").empty();
        $("#portfolioTable").empty();
        $("#soldInvestments").empty();
        //Shows the buy shares button on screen *Had to remove because double clicking caused bugs in DB*
        $(".buySharesBtn").css("display", "inline");
        //Chart values still persisting in backgound even if new chart is rendered.  Trying to fix that bug with this.
        myChart.destroy();
    })

    //Retrieves all stock data from the NASDAQ table and renders it to the table
    $("#nasdaqBtn").on("click", function() {
        //$(this).remove();
        $.get("/api/allNasdaq", function(data) {
            for(var i = 0; i < data.length; i++) {
                var symbol = data[i].symbol;
                var company = data[i].company_name;
                var newTr = $("<tr>");
                newTr.append("<td>" + symbol + "</td>");
                newTr.append("<td>" + company + "</td>");
                newTr.append("<td class='center'><button class='getBtn' value='" + symbol + "'>GET</button></td>")
                $("#nasdaqTable").append(newTr);
                $(".nasdaqModal").css("display", "block");
            }
        })
    })

    //Uses the GET button to make API call to pull live data for the chosen company
    $(document).on("click", ".getBtn", function() {
        
        myChart.destroy();
        $(".apiCallModal").css("display", "block");
        //$(".chartContainer1").css("display", "inline-block");
        var querySymbol = $(this).val();
        //Takes the companySymbol variable and includes it in the search to the IEX API to search for charts and news on the company    
        var stockURL = "https://api.iextrading.com/1.0//stock/" + querySymbol + "/batch?types=quote,news,chart&range=1m&last=7";
        $.ajax({
        method: "GET",
        url: stockURL
        })

        .then(function(response) {
            console.log(response);
            $(".stockName").text("Company: " + response.quote.companyName);
            $(".market").text("Market: " + response.quote.primaryExchange);
            $(".latestPrice").text("Price Per Share: " + response.quote.latestPrice);
            $(".latestTime").text("As of: " + response.quote.latestTime);
            //Buys the ammount of shares specified and adds the info to the stocks table in the DB
            $(".buySharesBtn").on("click", function() {
                //Removing it because an accidental double click caused 2 transactions
                $(".buySharesBtn").css("display", "none");
                console.log("Buying!");
                var num = $(".sharesToBuy").val();
                $(".purchasedStockInfo").html("<h3>" + num + " shares of " + response.quote.companyName + " purchased!</h3>");
                $(".stockPurchaseModal").css("display", "block");
                var todayDate = new Date().toISOString().slice(0,10);
                $.post("/api/stocks", {
                    symbol: response.quote.symbol,
                    company_name: response.quote.companyName,
                    market: response.quote.primaryExchange,
                    shares: $(".sharesToBuy").val(),
                    buy_date: todayDate,
                    buy_price: response.quote.latestPrice,
                    current_price: response.quote.latestPrice,
                    UserId: $("#selectUser").val()
                })
                $(".sharesToBuy").val("");
            })
            
            var arr = [];
            var dateArr = [];

            //Creates an array that stores price data and one that stores the dates.
            for(var i = 0; i < response.chart.length; i++) {
                arr.push(response.chart[i].close);
                dateArr.push(response.chart[i].date);
                companyDates = $.makeArray(dateArr);
                companyData = $.makeArray(arr);
            }

            //Function that creates chart
            $(function () {
                var ctx = $(".myChart");
                myChart = new Chart(ctx, { type: 'line', data: { labels: [], datasets: [] } });
                UpdateChart(myChart)
            });

            //Function that populates chart with search data
            function UpdateChart(myChart) {
                
                var data =  {
                            labels: companyDates,
                            datasets: [{
                                label: response.quote.companyName,
                                data: companyData,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                }
                myChart.data.labels = data.labels
                myChart.data.datasets = data.datasets
                myChart.update()
            }
        })

        
    })

    //GETs all users from the database and renders them on the page.
    function displayAllUsers() {
        $.get("/api/all", function(data) {
            console.log(data);
            
            for(var i = 0; i <data.length; i++) {
                var activeUser = data[i].username;
                //$("#activeAccts").append("<li><a href=''>" + activeUser + "</a></li><button id='" + data[i].id + " ' value='" + data[i].id + "'class='deleteUser'></button>");
                var newSelect = $("#selectUser");
                newSelect.append("<option value='" + data[i].id + "'>" + activeUser +"</option>");
            }
        });
    }

    //Search for specific company or group of companies on the NYSE
    $(".singleStockBtn").on("click", function() {
        var singleStockNyse = $(".singleStock").val();
        $.get("/api/nyse/" + singleStockNyse, function(data) {
            console.log(data);
            $(".singleStock").val("");
            for(var i = 0; i < data.length; i++) {
                var symbol = data[i].symbol;
                var company = data[i].company_name;
                var newTr = $("<tr>");
                newTr.append("<td>" + symbol + "</td>");
                newTr.append("<td>" + company + "</td>");
                newTr.append("<td class='center'><button class='getBtn' value='" + symbol + "'>GET</button></td>")
                $("#nyseQueryTable").append(newTr);
                $(".nyseQueryModal").css("display", "block");

            }
        })
    })

    //Search for specific company or group of companies on the NASDAQ
    $(".singleStockBtn2").on("click", function() {
        var singleStockNasdaq = $(".singleStock2").val();
        $.get("/api/nasdaq/" + singleStockNasdaq, function(data) {
            console.log(data);
            $(".singleStock2").val("");
            for(var i = 0; i < data.length; i++) {
                var symbol = data[i].symbol;
                var company = data[i].company_name;
                var newTr = $("<tr>");
                newTr.append("<td>" + symbol + "</td>");
                newTr.append("<td>" + company + "</td>");
                newTr.append("<td class='center'><button class='getBtn' value='" + symbol + "'>GET</button></td>")
                $("#nasdaqQueryTable").append(newTr);
                $(".nasdaqQueryModal").css("display", "block");
            }
        })
    })
    //Renders Users portfolio chart to the page with data from the Stocks table
    $(".portfolioBtn").on("click", function() {
        //$(this).remove();
        updatePortfolioTable();
        $(".portfolioModal").css("display", "block");
    })

    //Update stock price on your portfolio table
    $(document).on("click", ".updateBtn", function() {
        var querySymbol = $(this).val();
        //Takes the companySymbol variable and includes it in the search to the IEX API to search for charts and news on the company    
        var stockURL = "https://api.iextrading.com/1.0//stock/" + querySymbol + "/batch?types=quote,news,chart&range=1m&last=7";
        $.ajax({
        method: "GET",
        url: stockURL
        }).then(function(response) {
            console.log(response.quote.latestPrice);

            var currentPrice = {
                company_name: response.quote.companyName,
                current_price: response.quote.latestPrice
            }
            $.ajax({
                method: "PUT",
                url: "/api/stocks",
                data: currentPrice
            })
        })
        $("#portfolioTable").empty().append(updatePortfolioTable);
    })

    function updatePortfolioTable() {
        var userId = $("#selectUser").val();
        $.get("/api/stocksAll/" + userId, function(data) {
            var newTh = $("<tr>");
                newTh.append("<th>Symbol</th>");
                newTh.append("<th>Company Name</th>");
                newTh.append("<th>Market</th>");
                newTh.append("<th>Shares</th>");
                newTh.append("<th>Buy Date</th>");
                newTh.append("<th>Buy Price</th>");
                newTh.append("<th>Current Price</th>");
                newTh.append("<th>Total Invested</th>");
                newTh.append("<th>Net Gain/Loss</th>");
                newTh.append("<th>Update</th>");
                newTh.append("<th>Sell</th>");
                $("#portfolioTable").append(newTh);

            for(var i = 0; i < data.length; i++) {
                var symbol = data[i].symbol;
                var shares = data[i].shares;
                var buyPrice = data[i].buy_price;
                var currentPrice = data[i].current_price;
                var totalInvested = buyPrice * shares;
                    totalInvested = totalInvested.toFixed(2);
                var netTotal = currentPrice - buyPrice;
                    netTotal = netTotal * shares;
                    netTotal= netTotal.toFixed(2);
                
                var newTr = $("<tr>");
                newTr.append("<td>" + data[i].symbol + "</td>");
                newTr.append("<td>" + data[i].company_name + "</td>");
                newTr.append("<td>" + data[i].market + "</td>");
                newTr.append("<td class='center'>" + data[i].shares + "</td>");
                newTr.append("<td class='center'>" + data[i].buy_date.slice(0,10) + "</td>");
                newTr.append("<td class='center'> $" + data[i].buy_price + "</td>");
                newTr.append("<td class='center'> $" + data[i].current_price + "</td>");
                newTr.append("<td class='center'> $" + totalInvested + "</td>");
                newTr.append("<td class='center'> $" + netTotal + "</td>");
                newTr.append("<td class='center'><button class='updateBtn' value='" + symbol + "'>Update</button></td>")
                newTr.append("<td class='center'><button class='sellBtn' value='" + data[i].id + "'>Sell</button></td>")
                
                $("#portfolioTable").append(newTr);
            }
        })
        $.get("/api/soldAll/" + userId, function(data) {
            var newTh = $("<tr>");
                newTh.append("<th>Symbol</th>");
                newTh.append("<th>Company Name</th>");
                newTh.append("<th>Market</th>");
                newTh.append("<th>Shares</th>");
                newTh.append("<th>Buy Date</th>");
                newTh.append("<th>Buy Price</th>");
                newTh.append("<th>Sell Date</th>");
                newTh.append("<th>Sell Price</th>");
                newTh.append("<th>Net Gain/Loss</th>");
                $("#soldInvestments").append(newTh);

            for(var i = 0; i < data.length; i++) {
                
                var newTr = $("<tr>");
                newTr.append("<td>" + data[i].symbol + "</td>");
                newTr.append("<td>" + data[i].company_name + "</td>");
                newTr.append("<td>" + data[i].market + "</td>");
                newTr.append("<td class='center'>" + data[i].shares + "</td>");
                newTr.append("<td class='center'>" + data[i].buy_date.slice(0,10) + "</td>");
                newTr.append("<td class='center'> $" + data[i].buy_price + "</td>");
                newTr.append("<td class='center'>" + data[i].sell_date.slice(0,10) + "</td>");
                newTr.append("<td class='center'> $" + data[i].sell_price + "</td>");
                newTr.append("<td class='center'> $" + data[i].net_total + "</td>");
                $("#soldInvestments").append(newTr);
            }
        })
    }

    //Selling a stock when the "Sell" button is clicked
    $(document).on("click", ".sellBtn", function() {
        console.log("Selling!");
        var soldStock = $(".sellBtn").val();
        $.get("/api/stocks/" + soldStock, function(data) {
            console.log(data);
            sellSymbol = data[0].symbol;
            sellCompanyName = data[0].company_name;
            sellMarket = data[0].market;
            sellShares = data[0].shares;
            sellBuyDate = data[0].buy_date;
            sellBuyPrice = data[0].buy_price;
            sellCurrentPrice = data[0].current_price;
            sellNetTotal = sellCurrentPrice - sellBuyPrice;
            sellNetTotal = sellNetTotal * sellShares;
            sellNetTotal= sellNetTotal.toFixed(2);
            
            //Post data of stock sold to sold table in DB
            $.post("/api/sold", {
                symbol: sellSymbol,
                company_name: sellCompanyName,
                market: sellMarket,
                shares: sellShares,
                buy_date: sellBuyDate,
                buy_price: sellBuyPrice,
                sell_price: sellCurrentPrice,
                sell_date: todayDate,
                net_total: sellNetTotal,
                UserId: $("#selectUser").val()
            })
            //Delete stock from active portfolio
            
            $.ajax({
                method: "DELETE",
                url: "/api/stocks/" + soldStock
            }).then(
                console.log("Sold stock at id: " + soldStock)
        
            );
            $(".stockSellingModal").css("display", "block");
            $(".stockSellingInfo").html("<h2>" + sellShares + " shares of " + sellCompanyName + " sold!</h2>");
            
        })
    })
})




