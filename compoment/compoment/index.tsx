import { useEffect, useMemo, useRef } from "react";
import * as slice9data from "./img_json.json";

// 帮助函数：设置 px 和 %
const px = (v: number) => `${v}px`;
const p = (v: number) => `${v}%`;
const tosrc = (name: string) => `file://{images}/${name}.png`;

export const NinePanel = (props: { path: string; name: string; input_width: number; intput_height: number; scale?: number,className?:string,children?: React.ReactNode}) => {
  let { name, path, input_width, intput_height, scale } = props;

  const d_scale = useMemo(() => scale ?? 1, [scale]);

  //横向宽度实际宽度
  const global_width = useMemo(()=>{
     const data_jiaoluo = slice9data[name as keyof typeof slice9data]?.[1]
     const data_heng = slice9data[name as keyof typeof slice9data]?.[2]
     const width = data_jiaoluo.width * input_width + data_heng.width * input_width * d_scale + data_jiaoluo.width * input_width
     return width
  },[d_scale])

  //实际高度
    const global_height = useMemo(()=>{
        const data_jiaoluo = slice9data[name as keyof typeof slice9data]?.[1]
        const data_shu = slice9data[name as keyof typeof slice9data]?.[4]
        const height = data_jiaoluo.height * intput_height + data_shu.height * intput_height * d_scale + data_jiaoluo.height * intput_height
        return height
    },[d_scale])

  //竖向宽度


  // 根据区域 index 计算样式
  const regionStyles = (region: string, index: number) => {
    // 获取对应区域的九宫格数据
    //@ts-ignore
    const regionData = slice9data[region as keyof typeof slice9data]?.[index];
    if (!regionData) {
      console.error(`Invalid region or index: region=${region}, index=${index}`);
      return {};
    }

    const { x, y, width, height, x_px, y_px, width_px, height_px } = regionData;

    const new_input_width = input_width * d_scale;
    const new_intput_height = intput_height * d_scale;

    let finalWidth = width * new_input_width;
    let finalHeight = height * new_intput_height;

    // 基础样式，所有区域共享
    const baseStyle = {
      backgroundImage: `url('file://{images}/${path}/${name}')`,
      backgroundSize: `${input_width}px ${intput_height}px`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: `${-x * input_width}px ${-y * intput_height}px`,
    };

// 角落区域 (1, 3, 7, 9)，不拉伸，位置向中间偏移
    if([1, 3, 7, 9].includes(index)) {
       // 输出调试信息
    
       // 返回最终样式
       return {
         ...baseStyle,
         width: `${width *input_width}px`,
         height: `${height * intput_height}px`,
         backgroundSize: `${input_width}px ${intput_height}px`,
         backgroundPosition: `${-x * input_width}px ${-y * intput_height}px`,
       };
    }
  
    // 水平拉伸区域（2、6），按原样式
    if ([2, 8].includes(index)) {
      return {
        ...baseStyle,
        backgroundRepeat:"repeat-x",
        width: `${finalWidth}px`,
        height: `${height * intput_height}px`,
        backgroundSize: `${new_input_width}px ${intput_height}px`,
        backgroundPosition: `${-x * new_input_width}px ${-y * intput_height}px`,
      };
    }

    // 垂直拉伸区域（4、8），按原样式
    if ([4, 6].includes(index)) {
      return {
        ...baseStyle,       
        backgroundRepeat:"repeat-y",
        width: `${width * input_width}px`,
        height: `${finalHeight}px`,
        backgroundSize: `${input_width}px ${new_intput_height}px`,
        backgroundPosition: `${-x * input_width}px ${-y * new_intput_height}px`,
      };
    }

    // 中心区域（5），按原样式
    if (index === 5) {
      return {
        ...baseStyle,
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
        backgroundSize: `${new_input_width}px ${new_intput_height}px`,
        backgroundPosition: `${-x * new_input_width}px ${-y * new_intput_height}px`,
        backgroundRepeat:"no-repeat",
      };
    }

    // 默认情况，返回原始样式
    return {
      ...baseStyle,
      width: `${finalWidth}px`,
      height: `${finalHeight}px`,
    };
  };

  return (
    <Panel
      style={{
        width: px(global_width + 1),
        height: px(global_height + 1),
        flowChildren:"right-wrap"
      }}
      className={`ReactSlicedImage-root ${props.className}`}
    >
      {/* 渲染九个区域 */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
        index === 5 ? <Panel key={index} style={{ ...regionStyles(name, index) }}>{props.children}</Panel> :
        <Panel key={index} style={{ ...regionStyles(name, index) }} />
      ))}
    </Panel>
  );
};
