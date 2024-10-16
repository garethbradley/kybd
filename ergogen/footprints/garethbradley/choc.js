// Author: Ergogen + @infused-kim improvements
//
// Kailh Choc PG1350
// Nets
//    from: corresponds to pin 1
//    to: corresponds to pin 2
// Params
//    reverse: default is false
//      if true, will flip the footprint such that the pcb can be reversible
//    hotswap: default is true
//      if true, will include holes and pads for Kailh choc hotswap sockets
//    solder: default is false
//      if true, will include holes to solder switches (works with hotswap too)
//    outer_pad_width_front: default 2.6
//    outer_pad_width_back: default 2.6
//      Allow you to make the outer hotswap pads smaller to silence DRC
//      warnings when the sockets are to close to the edge cuts.
//    show_keycaps: default is true
//      if true, will add choc sized keycap box around the footprint
//    keycaps_x: default is 18
//    keycaps_y: default is 17
//      Allows you to adjust the width of the keycap outline. For example,
//      to show a 1.5u outline for easier aligning.
//
// notes:
// - hotswap and solder can be used together. The solder holes will then be
// - added above the hotswap holes.
//
// @infused-kim's improvements:
//  - Added hotswap socket outlines
//  - Moved switch corner marks from user layer to silk screen
//  - Added option to adjust keycap size outlines (to show 1.5u outline)
//  - Added option to add hotswap sockets and direct soldering holes at the
//    same time
//  - Made hotswap pads not overlap holes to fix DRC errors
//  - Fixed DRC errors "Drilled holes co-located"

module.exports = {
    params: {
        designator: 'S',
        reverse: false,
        hotswap: true,
        solder: false,
        outer_pad_width_front: 2.6,
        outer_pad_width_back: 2.6,
        show_keycaps: true,
        keycaps_x: 18,
        keycaps_y: 17,

        // This parameter defines on which side the actual switch should be.
        // Hotswap sockets and keycaps will be placed based on it.
        switch_3dmodel_side: '',

        keycap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Keycap_MBK_Black_1u.step',
        keycap_3dmodel_xyz_scale: '',
        keycap_3dmodel_xyz_rotation: '',
        keycap_3dmodel_xyz_offset: '',

        switch_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Switch.step',
        switch_3dmodel_xyz_scale: '',
        switch_3dmodel_xyz_rotation: '',
        switch_3dmodel_xyz_offset: '',

        hotswap_3dmodel_filename: '${EG_INFUSED_KIM_3D_MODELS}/Choc_V1_Hotswap.step',
        hotswap_3dmodel_xyz_scale: '',
        hotswap_3dmodel_xyz_rotation: '',
        hotswap_3dmodel_xyz_offset: '',

        from: undefined,
        to: undefined
    },
    body: p => {

        const gen_3d_model = (filename, scale, rotation, offset, side, {
            default_side =  'F',
            scale_f =       [1, 1, 1],
            rotation_f =    [0, 0, 0],
            offset_f =      [0, 0, 0],
            scale_b =       [1, 1, 1],
            rotation_b =    [0, 0, 0],
            offset_b =      [0, 0, 0]
        } = {}) => {

            if(filename == '') {
              return '';
            }

            const get_3d_model_side = (side, default_side) => {

                if(side == '') {
                    if(p.reverse == true) {
                        side = default_side;
                    } else {
                        side = p.side;
                    }
                }

                if(side == 'F' || side == 'B') {
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

            return  `
              (model ${filename}
                (at (xyz ${final_offset[0]} ${final_offset[1]} ${final_offset[2]}))
                (scale (xyz ${final_scale[0]} ${final_scale[1]} ${final_scale[2]}))
                (rotate (xyz ${final_rotation[0]} ${final_rotation[1]} ${final_rotation[2]}))
              )
            `;
        };

        const common_top = `
            (module PG1350 (layer F.Cu) (tedit 5DD50112)
            ${p.at /* parametric position */}
            (attr virtual)

            ${'' /* footprint reference */}
            (fp_text reference "${p.ref}" (at 0 0) (layer F.SilkS) ${p.ref_hide} (effects (font (size 1.27 1.27) (thickness 0.15))))

            ${''/* middle shaft */}
            (pad "" np_thru_hole circle (at 0 0) (size 3.429 3.429) (drill 3.429) (layers *.Cu *.Mask))

            ${''/* stabilizers */}
            (pad "" np_thru_hole circle (at 5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))
            (pad "" np_thru_hole circle (at -5.5 0) (size 1.7018 1.7018) (drill 1.7018) (layers *.Cu *.Mask))

            ${''/* corner marks - front */}
            (fp_line (start -7 -6) (end -7 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -6 7) (layer F.SilkS) (width 0.15))
            (fp_line (start -6 -7) (end -7 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -7 6) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 6) (end 7 7) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer F.SilkS) (width 0.15))
            (fp_line (start 6 7) (end 7 7) (layer F.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 7 -6) (layer F.SilkS) (width 0.15))

            ${''/* corner marks - back */}
            (fp_line (start -7 -6) (end -7 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -6 7) (layer B.SilkS) (width 0.15))
            (fp_line (start -6 -7) (end -7 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start -7 7) (end -7 6) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 6) (end 7 7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start 6 7) (end 7 7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 7 -6) (layer B.SilkS) (width 0.15))
        `

        const keycap_xo = 0.5 * p.keycaps_x
        const keycap_yo = 0.5 * p.keycaps_y
        const keycap_marks = `
            ${'' /* keycap marks - 1u */}
            (fp_line (start ${ -keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ keycap_xo } ${ -keycap_yo }) (end ${ keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ keycap_yo }) (layer Dwgs.User) (width 0.15))
            (fp_line (start ${ -keycap_xo } ${ keycap_yo }) (end ${ -keycap_xo } ${ -keycap_yo }) (layer Dwgs.User) (width 0.15))
        `

        const hotswap_common = `
            ${'' /* Middle Hole */}
            (pad "" np_thru_hole circle (at 0 -5.95) (size 3 3) (drill 3) (layers *.Cu *.Mask))

        `

        const hotswap_front_pad_cutoff = `
            (pad 1 smd custom (at -3.275 -5.95 ${p.rot}) (size 1 1) (layers B.Cu B.Paste B.Mask)
                (zone_connect 0)
                (options (clearance outline) (anchor rect))
                (primitives
                    (gr_poly (pts
                    (xy -1.3 -1.3) (xy -1.3 0.25) (xy -0.05 1.3) (xy 1.3 1.3) (xy 1.3 -1.3)
                ) (width 0))
            ) ${p.from.str})
        `

        const hotswap_front_pad_full = `
            (pad 1 smd rect (at -3.275 -5.95 ${p.rot}) (size 2.6 2.6) (layers B.Cu B.Paste B.Mask)  ${p.from.str})
        `

        const hotswap_front = `
            ${'' /* Silkscreen outline */}
            (fp_line (start 7 -7) (end 7 -6) (layer B.SilkS) (width 0.15))
            (fp_line (start 1.5 -8.2) (end 2 -7.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -1.5) (end 7 -2) (layer B.SilkS) (width 0.15))
            (fp_line (start -1.5 -8.2) (end 1.5 -8.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -7) (end 6 -7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -6.2) (end 2.5 -6.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 2.5 -2.2) (end 2.5 -1.5) (layer B.SilkS) (width 0.15))
            (fp_line (start -2 -7.7) (end -1.5 -8.2) (layer B.SilkS) (width 0.15))
            (fp_line (start -1.5 -3.7) (end 1 -3.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 7 -5.6) (end 7 -6.2) (layer B.SilkS) (width 0.15))
            (fp_line (start 2 -6.7) (end 2 -7.7) (layer B.SilkS) (width 0.15))
            (fp_line (start 2.5 -1.5) (end 7 -1.5) (layer B.SilkS) (width 0.15))
            (fp_line (start -2 -4.2) (end -1.5 -3.7) (layer B.SilkS) (width 0.15))
            (fp_arc (start 2.5 -6.2) (mid 2.1464 -6.3464) (end 2 -6.7) (layer B.SilkS) (width 0.15))
            (fp_arc (start 1 -3.7) (mid 2.0607 -3.2607) (end 2.5 -2.2) (layer B.SilkS) (width 0.15))

            ${'' /* Left Pad*/}

            ${p.reverse ? hotswap_front_pad_cutoff : hotswap_front_pad_full}

            ${'' /* Right Pad (not cut off) */}
            (pad 2 smd rect (at ${8.275 - (2.6 - p.outer_pad_width_back)/2} -3.75 ${p.rot}) (size ${p.outer_pad_width_back} 2.6) (layers B.Cu B.Paste B.Mask) ${p.to.str})

            ${'' /* Side Hole */}
            (pad "" np_thru_hole circle (at 5 -3.75 195) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        `

        const hotswap_back = `
            ${'' /* Silkscreen outline */}
            (fp_line (start 2 -4.2) (end 1.5 -3.7) (layer F.SilkS) (width 0.15))
            (fp_line (start 2 -7.7) (end 1.5 -8.2) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -5.6) (end -7 -6.2) (layer F.SilkS) (width 0.15))
            (fp_line (start 1.5 -3.7) (end -1 -3.7) (layer F.SilkS) (width 0.15))
            (fp_line (start -2.5 -2.2) (end -2.5 -1.5) (layer F.SilkS) (width 0.15))
            (fp_line (start -1.5 -8.2) (end -2 -7.7) (layer F.SilkS) (width 0.15))
            (fp_line (start 1.5 -8.2) (end -1.5 -8.2) (layer F.SilkS) (width 0.15))
            (fp_line (start -2.5 -1.5) (end -7 -1.5) (layer F.SilkS) (width 0.15))
            (fp_line (start -2 -6.7) (end -2 -7.7) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -1.5) (end -7 -2) (layer F.SilkS) (width 0.15))
            (fp_line (start -7 -6.2) (end -2.5 -6.2) (layer F.SilkS) (width 0.15))
            (fp_arc (start -2 -6.7) (mid -2.1464 -6.3464) (end -2.5 -6.2) (layer F.SilkS) (width 0.15))
            (fp_arc (start -2.5 -2.2) (mid -2.0607 -3.2607) (end -1 -3.7) (angle -90) (layer F.SilkS) (width 0.15))

            ${'' /* Right Pad (cut off) */}
            (pad 1 connect custom (at 3.275 -5.95 ${p.rot}) (size 0.5 0.5) (layers F.Cu F.Mask)
                (zone_connect 0)
                (options (clearance outline) (anchor rect))
                (primitives
                (gr_poly (pts
                    (xy -1.3 -1.3) (xy -1.3 1.3) (xy 0.05 1.3) (xy 1.3 0.25) (xy 1.3 -1.3)
                ) (width 0))
            ) ${p.from.str})

            ${'' /* Left Pad (not cut off) */}
            (pad 2 smd rect (at ${-8.275 + (2.6 - p.outer_pad_width_front)/2} -3.75 ${p.rot}) (size ${p.outer_pad_width_front} 2.6) (layers F.Cu F.Paste F.Mask) ${p.to.str})

            ${'' /* Side Hole */}
            (pad "" np_thru_hole circle (at -5 -3.75 195) (size 3 3) (drill 3) (layers *.Cu *.Mask))
        `

        // If both hotswap and solder are enabled, move the solder holes
        // "down" to the opposite side of the switch.
        // Since switches can be rotated by 90 degrees, this won't be a
        // problem as long as we switch the side the holes are on.
        let solder_offset_x_front = ''
        let solder_offset_x_back = '-'
        let solder_offset_y = '-'
        if(p.hotswap == true && p.solder == true) {
            solder_offset_x_front = '-'
            solder_offset_x_back = ''
            solder_offset_y = ''
        }
        const solder_common = `
            (pad 2 thru_hole circle (at 0 ${solder_offset_y}5.9 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.to.str})
        `

        const solder_front = `
            (pad 1 thru_hole circle (at ${solder_offset_x_front}5 ${solder_offset_y}3.8 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `

        const solder_back = `
            (pad 1 thru_hole circle (at ${solder_offset_x_back}5 ${solder_offset_y}3.8 195) (size 2.032 2.032) (drill 1.27) (layers *.Cu *.Mask) ${p.from.str})
        `

        const common_bottom = `
        )
        `

        const final = `
            ${common_top}

            ${p.show_keycaps ? keycap_marks : ''}

            ${p.hotswap ? hotswap_common : ''}
            ${p.hotswap ? hotswap_front : ''}
            ${p.hotswap && p.reverse ? hotswap_back : ''}

            ${p.solder ? solder_common : ''}
            ${p.solder ? solder_front : ''}
            ${p.solder && p.reverse ? solder_back : ''}

            ${ gen_3d_model(
                p.keycap_3dmodel_filename,
                p.keycap_3dmodel_xyz_scale,
                p.keycap_3dmodel_xyz_rotation,
                p.keycap_3dmodel_xyz_offset,
                p.switch_3dmodel_side,
                {
                    rotation_f: [0, 0, 0],
                    offset_f: [0, 0, 6.6],

                    rotation_b: [0, 180, 0],
                    offset_b: [0, 0, -(6.6+1.6)],
                },
            )}
            ${ gen_3d_model(
                p.switch_3dmodel_filename,
                p.switch_3dmodel_xyz_scale,
                p.switch_3dmodel_xyz_rotation,
                p.switch_3dmodel_xyz_offset,
                p.switch_3dmodel_side,
                {
                    rotation_f: [0, 0, 0],
                    offset_f: [0, 0, 0],

                    rotation_b: [0, 180, 0],
                    offset_b: [0, 0, -1.6],
                },
            )}

            ${ gen_3d_model(
                p.hotswap_3dmodel_filename,
                p.hotswap_3dmodel_xyz_scale,
                p.hotswap_3dmodel_xyz_rotation,
                p.hotswap_3dmodel_xyz_offset,
                p.switch_3dmodel_side,
                {
                    rotation_f: [0, 0, 0],
                    offset_f: [0, 0, 0],

                    rotation_b: [0, 180, 0],
                    offset_b: [0, 0, -1.6],
                },
            )}

            ${common_bottom}
        `

        return final
    }
}
