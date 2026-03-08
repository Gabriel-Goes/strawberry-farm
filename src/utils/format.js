(function (SF) {
  SF.utils = SF.utils || {};

  function formatSeconds(durationMs) {
    const seconds = Math.max(0, Math.ceil(durationMs / 1000));
    return `${seconds}s`;
  }

  function formatClock(timestamp) {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  SF.utils.formatSeconds = formatSeconds;
  SF.utils.formatClock = formatClock;
})(window.StrawberryFarm = window.StrawberryFarm || {});
