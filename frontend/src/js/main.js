import "../css/style.css";
import "../css/mission.css";

document.addEventListener("DOMContentLoaded", function () {
    const reveals = document.querySelectorAll(".scroll-reveal");
  
    function revealOnScroll() {
      const windowHeight = window.innerHeight;
      reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
          el.classList.add("revealed");
        }
      });
    }
  
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Run once on load
  });
