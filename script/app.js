

document.querySelector("#btnGetStarted").addEventListener('click', () => {
    document.querySelector("#divGetStarted").style = "display: none;"
    document.querySelector("#divDashboard").style = "display: block;"
})

document.querySelector("#btnHome").addEventListener('click', () => {
    document.querySelector("#divDashboard").style = "display: none;"
    document.querySelector("#divGetStarted").style = "display: block;"
})

document.querySelector("#btnEditor").addEventListener('click', () => {
    document.querySelector("#divEditor").style = "display: block;"
    document.querySelector("#divDashboard").style = "display: none;"
})

document.querySelector("#btnGoHome").addEventListener('click', () => {
    document.querySelector("#divGetStarted").style = "display: block;"
    document.querySelector("#divEditor").style = "display: none;"
})

document.querySelector("#btnBackToDash").addEventListener('click', () => {
    document.querySelector("#divDashboard").style = "display: block;"
    document.querySelector("#divEditor").style = "display: none;"
})