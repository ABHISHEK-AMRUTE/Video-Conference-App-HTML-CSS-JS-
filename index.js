const { userid } = Qs.parse(location.search, { ignoreQueryPrefix: true })
srcc="http://127.0.0.1:5500/main.html?userid="+userid

document.getElementById("main_frame").src= srcc