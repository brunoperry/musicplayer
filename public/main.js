window.visualViewport.addEventListener("resize", () => {
  console.log("Viewport Height:", window.visualViewport.height);

  document.body.style.height = `${window.visualViewport.height}px`;
});
