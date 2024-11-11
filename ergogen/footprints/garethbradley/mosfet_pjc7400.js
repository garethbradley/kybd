// Copyright (c) 2024 Gareth Bradley
//
// SPDX-License-Identifier: CC-BY-NC-SA-4.0
//
// To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
//
// Authors: @garethbradley
//
// Description:
//  Power MOSFET PANJIT PJC7400 in SOT-323 footprint.
//
// Datasheet:
//  https://www.panjit.com.tw/upload/datasheet/PJC7400.pdf
//
// Params:
//    side: default is B for Back
//      the side on which to place the single-side footprint and designator, either F or B
//    reversible: default is false
//      if true, the footprint will be placed on both sides so that the PCB can be
//      reversible
//    mosfet_3dmodel_filename: default is ''
//      Allows you to specify the path to a 3D model STEP or WRL file to be
//      used when rendering the PCB. Use the ${VAR_NAME} syntax to point to
//      a KiCad configured path.
//    mosfet_3dmodel_xyz_offset: default is [0, 0, 0]
//      xyz offset (in mm), used to adjust the position of the 3d model
//      relative the footprint.
//    mosfet_3dmodel_xyz_scale: default is [1, 1, 1]
//      xyz scale, used to adjust the size of the 3d model relative to its
//      original size.
//    mosfet_3dmodel_xyz_rotation: default is [0, 0, 0]
//      xyz rotation (in degrees), used to adjust the orientation of the 3d
//      model relative the footprint.

module.exports = {
  params: {
    designator: 'D',
    side: 'B',
    reversible: false,
    mosfet_3dmodel_filename: '',
    mosfet_3dmodel_xyz_offset: [-1.2, 0.7, 0.1],
    mosfet_3dmodel_xyz_rotation: [0, 0, 90],
    mosfet_3dmodel_xyz_scale: [1, 1, 1],
    source: { type: 'net', value: undefined },
    gate: { type: 'net', value: undefined },
    drain: { type: 'net', value: undefined }
  },
  body: p => {
    const standard_opening = `
    (footprint "garethbradley:mosfet_pjc7400"
        (layer "${p.side}.Cu")
        ${p.at}
        (property "Reference" "${p.ref}"
            (at 0 0 ${p.r})
            (layer "${p.side}.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
        )
        `
    const front = `
        (fp_line (start -0.675 -1.17) (end 0.735 -1.17) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -0.675 1.16) (end 0.735 1.16) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 0.735 -1.17) (end 0.735 -0.5) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 0.735 0.5) (end 0.735 1.16) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_poly
          (pts
            (xy -1.045 -1.15)
            (xy -1.285 -1.48)
            (xy -0.805 -1.48)
            (xy -1.045 -1.15)
          )
          (stroke (width 0.12) (type solid)) (fill solid) (layer "F.SilkS"))
        (fp_line (start -2.4 -1.3) (end 2.4 -1.3) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start -2.4 1.3) (end -2.4 -1.3) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 2.4 -1.3) (end 2.4 1.3) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 2.4 1.3) (end -2.4 1.3) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start -0.675 -0.6) (end -0.675 1.1) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -0.175 -1.1) (end -0.675 -0.6) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 0.675 -1.1) (end -0.175 -1.1) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 0.675 -1.1) (end 0.675 1.1) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 0.675 1.1) (end -0.675 1.1) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        
        (pad "1" smd roundrect (at -1.33 -0.65 ${p.r + 270}) (size 0.45 1.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.gate.str})
        (pad "2" smd roundrect (at -1.33 0.65 ${p.r + 270}) (size 0.45 1.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.source.str})
        (pad "3" smd roundrect (at 1.33 0 ${p.r + 270}) (size 0.45 1.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.drain.str})
        `
    const back = `
        (fp_line (start -0.675 -1.17) (end 0.735 -1.17) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -0.675 1.16) (end 0.735 1.16) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 0.735 -1.17) (end 0.735 -0.5) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 0.735 0.5) (end 0.735 1.16) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_poly
          (pts
            (xy -1.045 1.15)
            (xy -1.285 1.48)
            (xy -0.805 1.48)
            (xy -1.045 1.15)
          )
          (stroke (width 0.12) (type solid)) (fill solid) (layer "B.SilkS"))
        (fp_line (start -2.4 -1.3) (end 2.4 -1.3) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start -2.4 1.3) (end -2.4 -1.3) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 2.4 -1.3) (end 2.4 1.3) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 2.4 1.3) (end -2.4 1.3) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))

        (fp_line (start -0.675 0.6) (end -0.675 -1.1) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -0.175 1.1) (end -0.675 0.6) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 0.675 1.1) (end -0.175 1.1) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 0.675 1.1) (end 0.675 -1.1) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 0.675 -1.1) (end -0.675 -1.1) (stroke (width 0.1) (type solid)) (layer "B.Fab"))

        
        (pad "1" smd roundrect (at -1.33 0.65 ${p.r + 270}) (size 0.45 1.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.source.str})
        (pad "2" smd roundrect (at -1.33 -0.65 ${p.r + 270}) (size 0.45 1.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.gate.str})
        (pad "3" smd roundrect (at 1.33 0 ${p.r + 270}) (size 0.45 1.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.drain.str})
        `

    const mosfet_3dmodel = `
        (model ${p.mosfet_3dmodel_filename}
            (offset (xyz ${p.mosfet_3dmodel_xyz_offset[0]} ${p.mosfet_3dmodel_xyz_offset[1]} ${p.mosfet_3dmodel_xyz_offset[2]}))
            (scale (xyz ${p.mosfet_3dmodel_xyz_scale[0]} ${p.mosfet_3dmodel_xyz_scale[1]} ${p.mosfet_3dmodel_xyz_scale[2]}))
            (rotate (xyz ${p.mosfet_3dmodel_xyz_rotation[0]} ${p.mosfet_3dmodel_xyz_rotation[1]} ${p.mosfet_3dmodel_xyz_rotation[2]})))
        `
    const standard_closing = `
        )
        `

    let final = standard_opening;

    if (p.side == "F" || p.reversible) {
      final += front;
    }
    if (p.side == "B" || p.reversible) {
      final += back;
    }

    if (p.mosfet_3dmodel_filename) {
      final += mosfet_3dmodel
    }

    final += standard_closing;

    return final;
  }
}
