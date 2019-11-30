$(document).ready(function () {
    $("#nav-container").load("/page/nav.html", function () {
        var elems = document.querySelectorAll('.sidenav');
        window.sideNavInstance = M.Sidenav.init(elems);
        var dbPromise = idb.open("greatSoccer", 1, function (upgradeDb) {
            if (!upgradeDb.objectStoreNames.contains("team")) {
                upgradeDb.createObjectStore("team", {
                    keyPath: 'id',
                    autoIncrement: true,
                    unique: true
                });
            }
        })
        if (window.location.href.split("#").length > 1) {
            uri = "#" + window.location.href.split("#")[1];
            $("li").removeClass("active");
            $('li[data-uri="' + uri + '"]').addClass("active");
            loadPage(dbPromise, window.location.href.split("#")[1]);
        } else {
            loadPage(dbPromise, "home");
        }
        $(".nav-link").on("click", function () {
            uri = $(this).attr("href");
            $("li").removeClass("active");
            $('li[data-uri="' + uri + '"]').addClass("active");
            loadPage(dbPromise, (uri).split("#")[1]);
            window.sideNavInstance[0].close();
        })
    });
})

function loadPage(dbPromise, url) {
    $("#content-container").load("/page/" + url + ".html", function () {
        switch (url) {
            case "home":
                $.ajax({
                    type: "GET",
                    url: "https://api.football-data.org/v2/competitions/2021/standings",
                    headers: {
                        "X-Auth-Token": "aefc7b31d9d64cdeaeb0942fd47ad48c"
                    },
                    success: function (result) {
                        result.standings[0].table.forEach(element => {
                            $("#tempStanding").append(`
                                            <li>
                                                <div class="collapsible-header">
                                                    <b class="circle-number">` + element.position + `</b> ` + element.team.name + `
                                                    <div class="circle-result">
                                                    <span class="new badge red" data-badge-caption="Lost">` + element.lost + `</span>
                                                    <span class="new badge green" data-badge-caption="Won">` + element.won + `</span>
                                                </div>
                                                </div>
                                                <div class="collapsible-body">
                                                    <table class="striped">
                                                        <tr>
                                                            <td>Played Games</td>
                                                            <td>:</td>
                                                            <td><b>` + element.playedGames + `</b></td>
                                                            <td>Won</td>
                                                            <td>:</td>
                                                            <td><b>` + element.won + `</b></td>
                                                        </tr>
                                                        <tr>
                                                            <td>Draw</td>
                                                            <td>:</td>
                                                            <td><b>` + element.draw + `</b></td>
                                                            <td>Lost</td>
                                                            <td>:</td>
                                                            <td><b>` + element.lost + `</b></td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </li>
                                        `);
                        });
                        $('.collapsible').collapsible();
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        caches.match("https://api.football-data.org/v2/competitions/2021/standings").then(function (response) {
                            if (response) {
                                response.json().then(function (result) {
                                    result.standings[0].table.forEach(element => {
                                        $("#tempStanding").append(`
                                                        <li>
                                                            <div class="collapsible-header">
                                                                <b class="circle-number">` + element.position + `</b> ` + element.team.name + `
                                                                <div class="circle-result">
                                                                <span class="new badge red" data-badge-caption="Lost">` + element.lost + `</span>
                                                                <span class="new badge green" data-badge-caption="Won">` + element.won + `</span>
                                                            </div>
                                                            </div>
                                                            <div class="collapsible-body">
                                                                <table class="striped">
                                                                    <tr>
                                                                        <td>Played Games</td>
                                                                        <td>:</td>
                                                                        <td><b>` + element.playedGames + `</b></td>
                                                                        <td>Won</td>
                                                                        <td>:</td>
                                                                        <td><b>` + element.won + `</b></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Draw</td>
                                                                        <td>:</td>
                                                                        <td><b>` + element.draw + `</b></td>
                                                                        <td>Lost</td>
                                                                        <td>:</td>
                                                                        <td><b>` + element.lost + `</b></td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                        </li>
                                                    `);
                                    });
                                    $('.collapsible').collapsible();
                                })
                            }
                        });
                    }
                })
                break;
            case "me":
                dbPromise.then(function (db) {
                    var tx = db.transaction('team', 'readonly');
                    var store = tx.objectStore('team');
                    return store.getAll();
                }).then(function (val) {
                    if (val.length == 0) {
                        $("#teamContainer").html("<p>Your collection is empty</p>");
                    } else {
                        val.forEach(element => {
                            $("#teamContainer").append(`
                                            <div class="card horizontal">
                                                <div class="card-image">
                                                    <img src="` + element.crestUrl + `">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">
                                                        <h5>
                                                            ` + element.name + `
                                                        </h5>
                                                        <table>
                                                            <tr>
                                                                <th>
                                                                    Founded
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.founded + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Venue
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.venue + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Address
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.address + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Website
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.website + `
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <br>
                                                        <a class="waves-effect waves-light btn red darken-3 btn-small" onclick="deleteTeam(` + element.id + `)">Delete From Collection</a>
                                                    </div>
                                                </div>
                                            </div>`);
                        })
                    }
                });
                break;
            case "team":
                $.ajax({
                    type: "GET",
                    url: "https://api.football-data.org/v2/competitions/2021/teams",
                    headers: {
                        "X-Auth-Token": "aefc7b31d9d64cdeaeb0942fd47ad48c"
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        caches.match("https://api.football-data.org/v2/competitions/2021/teams").then(function (response) {
                            if (response) {
                                response.json().then(function (result) {

                                    result.teams.forEach(element => {
                                        $("#teamContainer").append(`
                                            <div class="card horizontal">
                                                <div class="card-image">
                                                    <img src="` + element.crestUrl + `">
                                                </div>
                                                <div class="card-stacked">
                                                    <div class="card-content">
                                                        <h5>
                                                            ` + element.name + `
                                                        </h5>
                                                        <table>
                                                            <tr>
                                                                <th>
                                                                    Founded
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.founded + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Venue
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.venue + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Address
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.address + `
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th>
                                                                    Website
                                                                </th>
                                                                <td>:</td>
                                                                <td>
                                                                    ` + element.website + `
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <a class="waves-effect waves-light btn-floating red favorite btn-small" onclick="saveTeam(` + element.id + `)">&#10084;</a>
                                                    </div>
                                                </div>
                                            </div>`);
                                    })
                                });
                            }
                        });
                    },
                    success: function (result) {
                        result.teams.forEach(element => {
                            $("#teamContainer").append(`
                                        <div class="card horizontal">
                                            <div class="card-image">
                                                <img src="` + element.crestUrl + `">
                                            </div>
                                            <div class="card-stacked">
                                                <div class="card-content">
                                                    <h5>
                                                        ` + element.name + `
                                                    </h5>
                                                    <table>
                                                        <tr>
                                                            <th>
                                                                Founded
                                                            </th>
                                                            <td>:</td>
                                                            <td>
                                                                ` + element.founded + `
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>
                                                                Venue
                                                            </th>
                                                            <td>:</td>
                                                            <td>
                                                                ` + element.venue + `
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>
                                                                Address
                                                            </th>
                                                            <td>:</td>
                                                            <td>
                                                                ` + element.address + `
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>
                                                                Website
                                                            </th>
                                                            <td>:</td>
                                                            <td>
                                                                ` + element.website + `
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    <a class="waves-effect waves-light btn-floating red favorite btn-small" onclick="saveTeam(` + element.id + `)">&#10084;</a>
                                                </div>
                                            </div>
                                        </div>`);
                        })
                    }
                })
                break;
        }
    })
}

function saveTeam(id) {
    caches.match("https://api.football-data.org/v2/competitions/2021/teams").then(function (response) {
        if (response) {
            response.json().then((result) => {
                result.teams.forEach(element => {
                    if (element.id == id) {
                        var dbPromise = idb.open("greatSoccer", 1, null);
                        dbPromise.then(function (db) {
                            var tx = db.transaction('team', 'readwrite');
                            var store = tx.objectStore('team');
                            store.put(element);
                            return tx.complete;
                        })
                    }
                })
            })
        }
        M.toast({
            html: 'Team has been saved !'
        })
    });
}

function deleteTeam(id) {
    var dbPromise = idb.open("greatSoccer", 1, null);
    dbPromise.then(function (db) {
        var tx = db.transaction('team', 'readwrite');
        var store = tx.objectStore('team');
        store.delete(id);
        return tx.complete;
    })
    loadPage(dbPromise, "me")
    M.toast({
        html: 'Team has been deleted !'
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}