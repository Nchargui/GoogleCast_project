
document.addEventListener("DOMContentLoaded", function() {
    const volumeControl = document.getElementById('volumeControl');
    const volumeBar = document.getElementById('volumeBar');
    const volumeKnob = document.getElementById('volumeKnob');

    volumeKnob.addEventListener('mousedown', startDragging);

    function startDragging(e) {
        e.preventDefault();
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }

    function drag(e) {
        const rect = volumeControl.getBoundingClientRect();
        let newX = e.clientX - rect.left;
        newX = Math.max(0, Math.min(newX, rect.width));
        volumeKnob.style.left = newX - volumeKnob.offsetWidth / 2 + 'px';
        volumeBar.style.width = newX + 'px';
    }

    function stopDragging(e) {
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDragging);
    }
});


