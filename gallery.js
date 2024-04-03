function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
}

function showExtendedView(id) {
    var extendedView = document.getElementById("extendedView" + id);
    extendedView.style.display = "block";
    window.onclick = function(event) {
        if (event.target == extendedView) {
            extendedView.style.display = "none";
        }
    }
}


