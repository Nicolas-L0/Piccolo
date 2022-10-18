#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

//in color 像素原颜色，已经在上一个 Tone Mapping Pass 中转换到了 SRGB 空间。
layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color; 

//2D 贴图采样器color_grading_lut_texture_sampler
layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    #if 0
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0); //获得2D贴图大小
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba; //获取in_color

    out_color = color;
    
    #else
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);   //获得2D贴图大小
    highp float x = float(lut_tex_size.x);                                          //定义x为贴图横向长度
    highp float y = float(lut_tex_size.y);                                          //定义y为贴图纵向长度
    highp float COLORS = y;                                                         //定义COLORS为每一cell的边长
    highp float MAXCOLOR = COLORS - 1.0;                                            //定义MAXCOLOR为边长-1
    highp float halfx = float(0.5 / x);                                             //定义halfx为单颜色块的1/2横向长度，用来指向颜色中心
    highp float halfy = float(0.5 / y);                                             //定义halfy为单颜色块的1/2纵向长度，用来指向颜色中心

    highp vec4 color = subpassLoad(in_color).rgba;                                  //获取in_color

    highp float g_offset = color.g * (MAXCOLOR / COLORS) + halfy;                   //计算green值(纵向)偏移
    highp float r_offset = color.r / COLORS * (MAXCOLOR / COLORS) + halfx;          //计算cell内部的red值(横向)偏移

    highp float cell = color.b * MAXCOLOR;                                          //计算blue值(cell)偏移
    highp float cell_l = floor(cell);                                               //分别向下、向上取整
    highp float cell_h = ceil(cell);

    highp vec2 lut_pos_l = vec2(r_offset + cell_l / COLORS , g_offset);             //分别用取整后的cell与red偏移作为横坐标，用green偏移作为纵坐标，计算lut坐标
    highp vec2 lut_pos_h = vec2(r_offset + cell_h / COLORS , g_offset);

    highp vec4 graded_color_l = texture(color_grading_lut_texture_sampler, lut_pos_l);      //查表
    highp vec4 graded_color_h = texture(color_grading_lut_texture_sampler, lut_pos_h);

    highp vec4 graded_color = mix(graded_color_l, graded_color_h, fract(cell));     //以cell的分数部分作为插值系数，将两次查表得到的颜色进行插值

    out_color = graded_color;                                                       //输出
    #endif
}
    // 
    // 根据位置采样 2D 贴图：
    // highp vec4 texture (uniform sampler2D sampler, highp vec2 pos)

    // highp vec2 uv = ;

    // highp vec4 color_sampled = texture(color_grading_lut_texture_sampler, uv);
    
    // texture(color_grading_lut_texture_sampler, uv);



    

