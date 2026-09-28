// Global utility functions
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || document.body;
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  toast.innerHTML = '<span class="toast-icon">' + icon + '</span><span class="toast-message">' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function setLoading(btn, text) {
  btn.classList.add('btn-loading');
  const original = btn.innerHTML;
  btn.innerHTML = text || 'Processing...';
  return () => {
    btn.classList.remove('btn-loading');
    btn.innerHTML = original;
  };
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  console.log('🤖 EpannRouter AI loaded');
});
