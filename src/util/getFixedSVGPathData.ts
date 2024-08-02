import { getFixedPathData } from "../lib/fix-svg-path-directions";

// Fix SVG path data
export function getFixedSVGPathData(elem: { attribs: { d: never } }) {
  // define normalization options
  const options = {
    //convert arcs to cubics
    arcToCubic: false,
    //convert quadratic béziers to cubics
    quadraticToCubic: false,
    // outer shapes should be in clockwise direction
    toClockwise: false,
    returnD: true,
    toAbsolute: true,
    toLonghands: true,
    arcAccuracy: 1,
  };

  // Fix path data
  const fixedPathData: never = getFixedPathData(elem.attribs.d, options);

  // Convert object to single string
  return fixedPathData
    .map((element: never) => {
      return `${element["type"]}${element["values"].join()}`;
    })
    .join(" ");
}
