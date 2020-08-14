import { cloneElement } from "react";

const saveBlobAsFile = (function () {
  const URL = window.URL || window.webkitURL;
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
})();

export const saveStringToFile = (data: string, deafultFilename: string) => {
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  saveBlobAsFile(blob, deafultFilename);
}

/**
 * A class that stores an array of jsx elements with unique keys. The unique keys are automatically
 * added to each element.
 */
export class JsxBuffer {
  private id = 0;

  constructor(private context: string) {}

  /**
   * Elements available for render.
   */
  public elements: JSX.Element[] = [];

  /**
   * Add an element to the element buffer.
   * @param element The jsx element. A unique key will automatically be added to the element.
   */
  public push(element: JSX.Element) {
    this.elements.push(
      cloneElement(element, {
        key: `${this.context}-${this.id++}`,
      })
    );
  }
}
