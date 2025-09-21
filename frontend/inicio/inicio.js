
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 12px 48px 0 rgba(0,0,0,0.32)';
    card.style.transform = 'translateY(-10px) scale(1.05)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
    card.style.transform = '';
  });
});





window.addEventListener('DOMContentLoaded', () => {
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.7s, transform 0.7s';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200 + i * 120);
  });
}); 