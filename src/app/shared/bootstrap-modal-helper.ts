let $ /* : JQueryStatic */ = (window as any)['jQuery'];

export var BootstrapModalHelper = {
  open(modalId: string) {
    $('#' + modalId).modal({ backdrop: 'live' });
  },

  onOpen(modalId: string, fun: () => void) {
    $('#' + modalId).on('shown.bs.modal', fun);
  },

  hide(modalId: string) {
    $('#' + modalId).modal('hide');
  },

  onHide(modalId: string, fun: () => void) {
    $('#' + modalId).on('hidden.bs.modal', fun);
  },
};
