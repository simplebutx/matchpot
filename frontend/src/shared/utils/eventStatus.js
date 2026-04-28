export function formatEventStatusLabel(status) {
  if (status === 'ENDED') {
    return '행사종료';
  }

  if (status === 'CLOSED') {
    return '모집종료';
  }

  return '모집중';
}

export function getEventStatusMeta(status) {
  if (status === 'ENDED') {
    return { label: '행사종료', className: 'is-closed' };
  }

  if (status === 'CLOSED') {
    return { label: '모집종료', className: 'is-closed' };
  }

  return { label: '모집중', className: 'is-open' };
}
