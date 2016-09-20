export default function pollUntil(poller, args = [], timeout = 3000, pollInterval = 200) {
  if (typeof args === 'number') {
    pollInterval = timeout;
    timeout = args;
    args = [];
  }

  let s1;
  let s2;

  function clearSchedulers() {
    clearTimeout(s1);
    clearTimeout(s2);
  }

  const p1 = new Promise(resolve => {
    (function poll() {
      const result = poller.apply(this, args);
      if (result) {
        resolve(result);
      } else {
        s1 = setTimeout(poll, pollInterval);
      }
    })();
  });

  const p2 = new Promise(resolve => {
    s2 = setTimeout(() => {
      resolve(null);
    }, timeout);
  });

  return Promise.race([p1, p2])
    .then(res => {
      clearSchedulers();
      return Promise.resolve(res);
    })
    .catch(e => {
      clearSchedulers();
      throw new Error(e);
    });
}
