window.EDITORIAL_SUPABASE = {
  url: "https://jzqxfhlowlllkiqvuqtd.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6cXhmaGxvd2xsbGtpcXZ1cXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5Njg3NDgsImV4cCI6MjEwNjU0NDc0OH0._SjV_jJYDml4d1SoPOpUBzFPFkWYkmO-aIuImvn9vRU"
};

(()=>{
  if (document.querySelector('script[data-editorial-bootstrap="v42"]')) return;
  const s = document.createElement('script');
  s.src = './js/bootstrap-v42.js?v=42';
  s.defer = true;
  s.dataset.editorialBootstrap = 'v42';
  document.head.appendChild(s);
})();
