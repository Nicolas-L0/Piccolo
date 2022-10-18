#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

//in color ����ԭ��ɫ���Ѿ�����һ�� Tone Mapping Pass ��ת������ SRGB �ռ䡣
layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color; 

//2D ��ͼ������color_grading_lut_texture_sampler
layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    #if 0
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0); //���2D��ͼ��С
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color       = subpassLoad(in_color).rgba; //��ȡin_color

    out_color = color;
    
    #else
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);   //���2D��ͼ��С
    highp float x = float(lut_tex_size.x);                                          //����xΪ��ͼ���򳤶�
    highp float y = float(lut_tex_size.y);                                          //����yΪ��ͼ���򳤶�
    highp float COLORS = y;                                                         //����COLORSΪÿһcell�ı߳�
    highp float MAXCOLOR = COLORS - 1.0;                                            //����MAXCOLORΪ�߳�-1
    highp float halfx = float(0.5 / x);                                             //����halfxΪ����ɫ���1/2���򳤶ȣ�����ָ����ɫ����
    highp float halfy = float(0.5 / y);                                             //����halfyΪ����ɫ���1/2���򳤶ȣ�����ָ����ɫ����

    highp vec4 color = subpassLoad(in_color).rgba;                                  //��ȡin_color

    highp float g_offset = color.g * (MAXCOLOR / COLORS) + halfy;                   //����greenֵ(����)ƫ��
    highp float r_offset = color.r / COLORS * (MAXCOLOR / COLORS) + halfx;          //����cell�ڲ���redֵ(����)ƫ��

    highp float cell = color.b * MAXCOLOR;                                          //����blueֵ(cell)ƫ��
    highp float cell_l = floor(cell);                                               //�ֱ����¡�����ȡ��
    highp float cell_h = ceil(cell);

    highp vec2 lut_pos_l = vec2(r_offset + cell_l / COLORS , g_offset);             //�ֱ���ȡ�����cell��redƫ����Ϊ�����꣬��greenƫ����Ϊ�����꣬����lut����
    highp vec2 lut_pos_h = vec2(r_offset + cell_h / COLORS , g_offset);

    highp vec4 graded_color_l = texture(color_grading_lut_texture_sampler, lut_pos_l);      //���
    highp vec4 graded_color_h = texture(color_grading_lut_texture_sampler, lut_pos_h);

    highp vec4 graded_color = mix(graded_color_l, graded_color_h, fract(cell));     //��cell�ķ���������Ϊ��ֵϵ���������β��õ�����ɫ���в�ֵ

    out_color = graded_color;                                                       //���
    #endif
}
    // 
    // ����λ�ò��� 2D ��ͼ��
    // highp vec4 texture (uniform sampler2D sampler, highp vec2 pos)

    // highp vec2 uv = ;

    // highp vec4 color_sampled = texture(color_grading_lut_texture_sampler, uv);
    
    // texture(color_grading_lut_texture_sampler, uv);



    

