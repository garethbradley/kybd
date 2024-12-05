// Copyright (c) 2023 Marco Massarelli
//
// SPDX-License-Identifier: MIT
//
// To view a copy of this license, visit https://opensource.org/license/mit/
//
// Author: @ceoloide + @garethbradley improvements
//
// Description:
//  A reversible JST PH 2.0mm footprint with support for solder jumpers and traces. This is
//  the same part sold at Typeractive.xyz and LCSC.
//
//  Note that the footprint's courtyard includes the space required for the male connector
//  and its cables. Make sure to leave enough room in front of the connector. The silkscreen
//  includes a handy reference for positive and negative terminals that remains visible
//  after the connector is soldered, to ensure wire polarity is correct.
//
// Datasheet:
//  https://cdn.shopify.com/s/files/1/0618/5674/3655/files/JST-S2B-PH-K.pdf?v=1670451309
//
// Params
//    side: default is F for Front
//      the side on which to place the single-side footprint and designator, either F or B
//    reversible: default is false
//      if true, the footprint will be placed on both sides so that the PCB can be
//      reversible
//    include_traces: default is true
//      if true it will include traces that connect the jumper pads to the connector pins
//    trace_width: default is 0.250mm
//      allows to override the trace width that connects the jumper pads to the connector
//      pins. Not recommended to go below 0.25mm.
//    include_silkscreen: default is true
//      if true it will include the silkscreen. Recommended to be true to ensure connector
//      polarity is not reversed, which can lead to shorting and damage to the MCU
//    include_fabrication: default is true
//      if true it will include the outline of the connector in the fabrication layer
//    include_courtyard: default is true
//      if true it will include a courtyard outline around the connector and in front of it
//      to also account for the male connector plug and the wires. Recommended to be true
//      at least once in the development of a board to confirm sufficient clearance for the
//      connector and wires.
//
//  3D model created my Sig Elso
//  https://grabcad.com/library/jst-ph-2-0mm-smd-r-a-1

module.exports = {
    params: {
        designator: 'JST',
        side: 'F',
        reversible: false,
        trace_width: 0.250,
        include_silkscreen: true,
        include_fabrication: true,
        include_courtyard: true,
        BAT_P: { type: 'net', value: 'BAT_P' },
        BAT_N: { type: 'net', value: 'GND' },

        socket_3dmodel_filename: '${EG_GARETHBRADLEY_3D_MODELS}/JST-PH-2-v1.STEP',
        socket_3dmodel_side: '',
        socket_3dmodel_xyz_scale: '',
        socket_3dmodel_xyz_rotation: [-90,0,0],
        socket_3dmodel_xyz_offset: [0,-4.2,0],
    },
    body: p => {
        const gen_3d_model = (filename, scale, rotation, offset, side, {
            default_side = 'F',
            scale_f = [1, 1, 1],
            rotation_f = [0, 0, 0],
            offset_f = [0, 0, 0],
            scale_b = [1, 1, 1],
            rotation_b = [0, 0, 0],
            offset_b = [0, 0, 0]
        } = {}) => {

            if (filename == '') {
                return '';
            }

            const get_3d_model_side = (side, default_side) => {

                if (side == '') {
                    if (p.reverse == true) {
                        side = default_side;
                    } else {
                        side = p.side;
                    }
                }

                if (side == 'F' || side == 'B') {
                    return side;
                } else {
                    return default_side;
                }
            }

            const final_side = get_3d_model_side(side, default_side, p);
            const is_front = final_side === 'F';

            // Determine the actual values to use
            const final_scale = scale || (is_front ? scale_f : scale_b);
            const final_rotation = rotation || (is_front ? rotation_f : rotation_b);
            let final_offset = offset || (is_front ? offset_f : offset_b);

            // Fix bug that seems to happen during the upgrade from KiCad 5 to
            // 8. All offset values seem to be multiplied by 25.4. So here we
            // divide them so that the upgrade KiCad file ends up with the
            // correct value.
            const offset_divisor = 25.4;
            final_offset = final_offset.map(value => value / offset_divisor);

            return `
          (model ${filename}
            (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
            (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
            (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
          )
        `;
        };

        let local_nets = [
            p.local_net("1"),
            p.local_net("2"),
        ];

        const standard_opening = `
    (footprint "garethbradley:battery_connector_jst_ph_2_smd"
        (layer "${p.side}.Cu")
        ${p.at}
        (property "Reference" "${p.ref}"
            (at 0 4.8 ${p.r})
            (layer "${p.side}.SilkS")
            ${p.ref_hide}
            (effects (font (size 1 1) (thickness 0.15)))
        )
        `
        const front_fabrication = `
        (fp_line (start -3.95 -3.2) (end -3.95 4.4) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -3.95 -3.2) (end -3.15 -3.2) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -3.95 4.4) (end 3.95 4.4) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -3.15 -3.2) (end -3.15 -1.6) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -3.15 -1.6) (end 3.15 -1.6) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -1.5 -1.6) (end -1 -0.892893) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start -1 -0.892893) (end -0.5 -1.6) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 3.15 -3.2) (end 3.95 -3.2) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 3.15 -1.6) (end 3.15 -3.2) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        (fp_line (start 3.95 -3.2) (end 3.95 4.4) (stroke (width 0.1) (type solid)) (layer "F.Fab"))
        `

        const front_courtyard = `
        (fp_line (start -4.6 -5.1) (end -4.6 5.1) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start -4.6 5.1) (end 4.6 5.1) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 4.6 -5.1) (end -4.6 -5.1) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        (fp_line (start 4.6 5.1) (end 4.6 -5.1) (stroke (width 0.05) (type solid)) (layer "F.CrtYd"))
        `

        const front_silkscreen = `
        (fp_line (start -4.06 -3.31) (end -3.04 -3.31) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -4.06 0.94) (end -4.06 -3.31) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -3.04 -3.31) (end -3.04 -1.71) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -3.04 -1.71) (end -1.76 -1.71) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -2.34 4.51) (end 2.34 4.51) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start -1.76 -1.71) (end -1.76 -4.6) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 3.04 -3.31) (end 3.04 -1.71) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 3.04 -1.71) (end 1.76 -1.71) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 4.06 -3.31) (end 3.04 -3.31) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        (fp_line (start 4.06 0.94) (end 4.06 -3.31) (stroke (width 0.12) (type solid)) (layer "F.SilkS"))
        `
        const back_fabrication = `
        (fp_line (start -3.95 -3.2) (end -3.95 4.4) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -3.95 -3.2) (end -3.15 -3.2) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -3.95 4.4) (end 3.95 4.4) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -3.15 -3.2) (end -3.15 -1.6) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start -3.15 -1.6) (end 3.15 -1.6) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        
        (fp_line (start 0.5 -1.6) (end 1 -0.892893) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 1 -0.892893) (end 1.5 -1.6) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        
        (fp_line (start 3.15 -3.2) (end 3.95 -3.2) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 3.15 -1.6) (end 3.15 -3.2) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        (fp_line (start 3.95 -3.2) (end 3.95 4.4) (stroke (width 0.1) (type solid)) (layer "B.Fab"))
        `
        const back_courtyard = `
        (fp_line (start -4.6 -5.1) (end -4.6 5.1) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start -4.6 5.1) (end 4.6 5.1) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 4.6 -5.1) (end -4.6 -5.1) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        (fp_line (start 4.6 5.1) (end 4.6 -5.1) (stroke (width 0.05) (type solid)) (layer "B.CrtYd"))
        `
        const back_silkscreen = `
        (fp_line (start -4.06 -3.31) (end -3.04 -3.31) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -4.06 0.94) (end -4.06 -3.31) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -3.04 -3.31) (end -3.04 -1.71) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -3.04 -1.71) (end -1.76 -1.71) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start -2.34 4.51) (end 2.34 4.51) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))

        (fp_line (start 1.76 -1.71) (end 1.76 -4.6) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        
        (fp_line (start 3.04 -3.31) (end 3.04 -1.71) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 3.04 -1.71) (end 1.76 -1.71) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 4.06 -3.31) (end 3.04 -3.31) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        (fp_line (start 4.06 0.94) (end 4.06 -3.31) (stroke (width 0.12) (type solid)) (layer "B.SilkS"))
        `
        const front_pads = `
        (pad "1" smd roundrect (at -1 -2.85 ${p.r}) (size 1 3.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.BAT_P.str})
        (pad "2" smd roundrect (at 1 -2.85 ${p.r}) (size 1 3.5) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.25) ${p.BAT_N.str})
        (pad "MP" smd roundrect (at -3.35 2.9 ${p.r}) (size 1.5 3.4) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.166667))
        (pad "MP" smd roundrect (at 3.35 2.9 ${p.r}) (size 1.5 3.4) (layers "F.Cu" "F.Paste" "F.Mask") (roundrect_rratio 0.166667))
        `

        const back_pads = `
        (pad "2" smd roundrect (at -1 -2.85 ${p.r}) (size 1 3.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.BAT_N.str})
        (pad "1" smd roundrect (at 1 -2.85 ${p.r}) (size 1 3.5) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.25) ${p.BAT_P.str})
        (pad "MP" smd roundrect (at -3.35 2.9 ${p.r}) (size 1.5 3.4) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.166667))
        (pad "MP" smd roundrect (at 3.35 2.9 ${p.r}) (size 1.5 3.4) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.166667))
        `

        const standard_closing = `
    )
        `

        const all_3d_models = `
        ${gen_3d_model(
            p.socket_3dmodel_filename,
            p.socket_3dmodel_xyz_scale,
            p.socket_3dmodel_xyz_rotation,
            p.socket_3dmodel_xyz_offset,
            p.socket_3dmodel_side,
            {
                rotation_f: [180, 0, 180],
                offset_f: [1, 0, 0],

                rotation_b: [180, 0, 0],
                offset_b: [-1, 0, 0],
            },
        )
            }
    `

        let final = standard_opening;

        if (p.side == "F" || p.reversible) {
            if (p.include_fabrication) {
                final += front_fabrication;
            }
            if (p.include_courtyard) {
                final += front_courtyard;
            }
            if (p.include_silkscreen) {
                final += front_silkscreen;
            }

            final += front_pads;
        }
        if (p.side == "B" || p.reversible) {
            if (p.include_fabrication) {
                final += back_fabrication;
            }
            if (p.include_courtyard) {
                final += back_courtyard;
            }
            if (p.include_silkscreen) {
                final += back_silkscreen;
            }

            final += back_pads;
        }

        final += all_3d_models;
        final += standard_closing;

        return final;
    }
}