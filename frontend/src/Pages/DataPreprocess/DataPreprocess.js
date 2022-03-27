import React, { useState, useEffect } from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactHtmlParser from 'react-html-parser';
import './DataPreprocess.css';

import { Pie } from '@antv/g2plot';
import { Scatter } from '@antv/g2plot';
import { Bar } from '@antv/g2plot';
import { Line } from '@antv/g2plot';
import { Column } from '@antv/g2plot';
import { Area } from '@antv/g2plot';

import { getStorage, ref, getDownloadURL } from "firebase/storage";

import ReactToPdf from "react-to-pdf";
import { Select } from 'antd';

const pdfref = React.createRef();
const userpdfref = React.createRef();

const options = {
    orientation: 'landscape',
    unit: 'in'
};

const { Option } = Select;

export default function DataPreprocess() {
    const [df, set_df] = useState("");
    const [json_data, set_json_data] = useState("");
    const [upload_success, set_upload_success] = useState(false);
    const [Visualize_data, set_visualize_data] = useState(false);
    const [pdf_button, set_pdf_button] = useState(false);
    const [chart, set_chart] = useState("");
    const [columns, set_columns] = useState([]);
    const [XYvalue, set_xyvalue] = useState({ X: "", Y: "" });

    const [showDownload, setShowDownload] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");

    useEffect(() => {
        handle2axis();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [XYvalue]);

    const props = {
        name: 'file',
        action: 'http://127.0.0.1:5000/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            console.log(info);
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                if(info.file.response.ogFileName.substr(info.file.response.ogFileName.length-4) === ".zip"){
                    setShowDownload(true);
                    console.log("DOneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                    const storage = getStorage();
                    getDownloadURL(ref(storage, info.file.response.nameText))
                        .then(url => {
                            // console.log("url ", url);
                            setDownloadLink(url);
                        })
                        .catch(err => console.log(err))

                    message.success(`${info.file.response.ogFileName} file uploaded successfully`);
                }else{                    
                    console.log(info.file.response.nameText);
                    setShowDownload(true);
                    setDownloadLink(info.file.response.nameText);
                    set_df(info.file.response.data);

                    const storage = getStorage();
                    getDownloadURL(ref(storage, info.file.response.nameText))
                        .then(url => {
                            // console.log("url ", url);
                            setDownloadLink(url);
                        })
                        .catch(err => console.log(err))


                        set_json_data(JSON.parse(info.file.response.json_data));
                        console.log("Upload Success");
                        set_upload_success(true);
                        console.log("Upload Success");
    
                        // console.log("__________________________________________________________________")
                        // console.log(Object.keys(JSON.parse(info.file.response.json_data)));
                        setColumns(info.file.response.json_data);
                        // piechartData(JSON.parse(info.file.response.json_data).Species)
    
                        // console.log("++++++++++++++++++++++++++++++++");
                        setTable();
                    message.success(`${info.file.name} file uploaded successfully`);
                    }
            } else if (info.file.status === 'error') {
                // console.log("NOOOOOOOOOOOOOOOOO");
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        progress: {
            strokeColor: {
                '0%': '#108ee9',
                '100%': '#87d068',
            },
            strokeWidth: 3,
            format: percent => `${parseFloat(percent.toFixed(2))}%`,
        },
    };

    const setColumns = (data) => {
        set_columns(Object.keys(JSON.parse(data)));

    }

    const handleChangePieChart = (v) => {
        // console.log(`selected ${v}`);
        var data = [];
        var d = piechartData(json_data[v]);
        for (var key in d) {
            data.push({ type: key, value: d[key] });
        }
        // console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL", data);
        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userPieChart" + v);
        document.getElementById("user_charts").innerHTML = "";
        document.getElementById("user_charts").appendChild(divchart);
        const ppiePlot = new Pie('userPieChart' + v, {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 0.75,
            label: {
                type: 'spider',
                labelHeight: 28,
                content: '{name}\n{percentage}',
            },
            interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
        });

        ppiePlot.render();

    }

    const handleChange = (value) => {
        set_chart(value);
        set_pdf_button(true);
        // console.log(`selected ${value}`);
    }

    const handle2axis = () => {
        // console.log(XYvalue.X, XYvalue.Y);
        if (XYvalue.X !== "" && XYvalue.Y !== "") {
            var data = [];
            for (var i = 0; i < Object.keys(json_data[XYvalue.X]).length; i++) {
                var obj = {};
                obj[XYvalue.X] = json_data[XYvalue.X][i];
                obj[XYvalue.Y] = json_data[XYvalue.Y][i];
                // data.push({x:json_data[XYvalue.X][i], y:json_data[XYvalue.Y][i]});
                data.push(obj);
            }
            // console.log("TTTTTTTTTYYYYYYYYYYYYYYY", data);

            if (chart === "Scatter Plot") scatterPlotter(data);
            if (chart === "Bar Graph") barGraphPlotter(data);
            if (chart === "Line Graph") lineGraphPlotter(data);
            if (chart === "Column Plot") columnPlotter(data);
            if (chart === "Area Plot") areaPlotter(data);



        }
    }

    function scatterPlotter(data) {

        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userScatterPlot" + XYvalue.X + XYvalue.Y);
        document.getElementById("user_charts").innerHTML = "";

        document.getElementById("user_charts").appendChild(divchart);

        var scatterPlot = new Scatter("userScatterPlot" + XYvalue.X + XYvalue.Y, {
            appendPadding: 20,
            data,
            xField: XYvalue.X,
            yField: XYvalue.Y,
            size: 5,
            pointStyle: {
                stroke: '#777777',
                lineWidth: 1,
                fill: '#5B8FF9',
            },
            xAxis:{
                title:{
                  text:XYvalue.X
                }
            },
            yAxis:{
                title:{
                  text:XYvalue.Y
                }
            },
            regressionLine: {
                type: 'quad', // linear, exp, loess, log, poly, pow, quad
            },
        });
        scatterPlot.render();

    }

    function barGraphPlotter(data) {

        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userBarPlot" + XYvalue.X + XYvalue.Y);
        document.getElementById("user_charts").innerHTML = "";

        document.getElementById("user_charts").appendChild(divchart);

        const barPlot = new Bar("userBarPlot" + XYvalue.X + XYvalue.Y, {
            appendPadding: 20,
            data,
            xField: XYvalue.X,
            yField: XYvalue.Y,
            xAxis:{
                title:{
                  text:XYvalue.X
                }
            },
            yAxis:{
                title:{
                  text:XYvalue.Y
                }
            },
            minBarWidth: 20,
            maxBarWidth: 20,
        });

        barPlot.render();

    }

    function lineGraphPlotter(data) {

        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userLinePlot" + XYvalue.X + XYvalue.Y);
        document.getElementById("user_charts").innerHTML = "";

        document.getElementById("user_charts").appendChild(divchart);

        const line = new Line("userLinePlot" + XYvalue.X + XYvalue.Y, {
            appendPadding: 20,
            data,
            padding: 'auto',
            xField: XYvalue.X,
            yField: XYvalue.Y,
            xAxis: {
                // type: 'timeCat',
                title:{
                    text:XYvalue.X
                },
                tickCount: 5,
            },
            yAxis:{
                title:{
                  text:XYvalue.Y
                }
            },
            smooth: true,
        });

        line.render();


    }

    function columnPlotter(data) {

        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userColumnPlot" + XYvalue.X + XYvalue.Y);
        document.getElementById("user_charts").innerHTML = "";

        document.getElementById("user_charts").appendChild(divchart);


        const columnPlot = new Column("userColumnPlot" + XYvalue.X + XYvalue.Y, {
            data,
            xField: XYvalue.X,
            yField: XYvalue.Y,
            yAxis:{
                title:{
                  text:XYvalue.Y
                }
            },
            label: {

                position: 'middle', // 'top', 'bottom', 'middle',
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
            xAxis: {
                title:{
                    text:XYvalue.X
                },
                label: {
                    autoHide: true,
                    autoRotate: false,
                },
                slider: {
                    start: 0.1,
                    end: 0.2,
                }
            }
        });

        columnPlot.render();


    }

    function areaPlotter(data) {

        var divchart = document.createElement("div");
        divchart.setAttribute("id", "userAreaPlot" + XYvalue.X + XYvalue.Y);
        document.getElementById("user_charts").innerHTML = "";

        document.getElementById("user_charts").appendChild(divchart);

        const area = new Area("userAreaPlot" + XYvalue.X + XYvalue.Y, {
            data,
            xField: XYvalue.X,
            yField: XYvalue.Y,
            xAxis: {
                range: [0, 1],
                title:{
                  text:XYvalue.X
                }
            },
            yAxis:{
                title:{
                  text:XYvalue.Y
                }
            }
        });
        area.render();


    }

    function piechartData(data) {
        var arr = {};
        // console.log(Object.keys(data).length);
        for (var i = 0; i < Object.keys(data).length; i++) {

            if (arr.hasOwnProperty(data[i])) {
                arr[data[i]]++;
                // console.log("Foundddddddd");
            }
            else {
                arr[data[i]] = 1;
            }
        }
        // console.log(arr);
        return arr;

    }


    function defaultPieChartCreator() {
        var strarr = [];
        // console.log(columns.length);
        if (columns.length > 0) {
            for (var i = 0; i < columns.length; i++) {
                // console.log(json_data[columns[i]][0], typeof(json_data[columns[i]][0]));
                // console.log(typeof(json_data[columns[i]][0]));
                if (typeof (json_data[columns[i]][0]) == "string") {
                    strarr.push(columns[i]);
                }
            }
        }
        // console.log(strarr);
        var piedataAll = [];
        for (var j = 0; j < strarr.length; j++) {
            var piedata = [];
            var d = piechartData(json_data[strarr[j]]);
            for (var key in d) {
                piedata.push({ type: key, value: d[key] });
            }
            piedataAll.push(piedata);
        }
        // console.log(piedataAll);

        for (let i = 0; i < piedataAll.length; i++) {
            var data = piedataAll[i];
            var divchart = document.createElement("div");
            divchart.setAttribute("id", "defaultPieCharts" + i);
            document.getElementById("charts").appendChild(divchart);
            const piePlot = new Pie('defaultPieCharts' + i, {
                appendPadding: 10,
                data,
                angleField: 'value',
                colorField: 'type',
                radius: 0.75,
                label: {
                    type: 'spider',
                    labelHeight: 28,
                    content: '{name}\n{percentage}',
                },
                interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
            });

            piePlot.render();

        }
    }

    const setTable = () => {
        // console.log("HEREEEEEEEEEEEEEEEEE");

        // var tab = document.getElementsByClassName('dataframe')[0];
        // if(tab){
        //     tab.style.width = "100%";
        //     tab.style.textAlign = "center";
        // }
        // var th = document.getElementsByTagName('thead')[0];
        // if(th){
        //     th.style.align = "center";
        // }
        // if(tab){
        //     tab.style.width = "100%";
        //     tab.style.textAlign = "center";
        // }

        // console.log(tab.innerHTML);
        // let tbody = [...document.getElementsByTagName("tr")];
        // console.log(tbody.slice(0, 30));
        // document.getElementsByTagName("tbody").innerHTML = tbody.slice(0,30);
    }
    return (
        <div>
            <h2>Data Preprocessing</h2>
            <p>Upload any dataset</p>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload Dataset</Button>
            </Upload>
            {/* <p>Upload Image dataset</p>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload <strong> ZIPPED </strong> Image Dataset</Button>
            </Upload> */}
            {showDownload && downloadLink &&
                <>
                    <Button
                        type='primary'
                        href={downloadLink}
                        style={{ margin: "10px 0 10px 0" }}
                    >
                        Download Processed Dataset
                    </Button>
                    <br />
                </>
            }

            {upload_success &&
                <Button onClick={() => { set_visualize_data(!Visualize_data); setTable(); defaultPieChartCreator(); }}>{Visualize_data ? "Show table" : "Visualize Data"}</Button>
            }

            {!Visualize_data &&
                <div id="processed_data" onChange={() => setTable()} style={{ marginTop: "20px" }}>{ReactHtmlParser(df)}</div>
            }

            {Visualize_data &&
                <>
                    <Select defaultValue="Select Chart" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="Pie Chart">Pie Chart</Option>
                        <Option value="Scatter Plot">Scatter Plot</Option>
                        <Option value="Bar Graph">Bar Graph</Option>
                        <Option value="Line Graph">Line Graph</Option>
                        <Option value="Column Plot">Column Plot</Option>
                        <Option value="Area Plot">Area Plot</Option>
                        <Option value="Select Chart" disabled>
                            Select Chart
                        </Option>
                    </Select>
                    {chart === "Pie Chart" &&
                        <Select defaultValue="Select Column" style={{ width: 120 }} onChange={handleChangePieChart}>
                            {columns.map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    }
                    {chart !== "Pie Chart" && chart !== "" &&
                        <>
                            <Select defaultValue="Select X-Column" style={{ width: 120 }} onChange={(value) => { set_xyvalue(prevstate => ({ ...prevstate, X: value })) }}>
                                {columns.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                                <Option value="Select X-Column" disabled>
                                    Select X-Column
                                </Option>
                            </Select>
                            <Select defaultValue="Select Y-Column" style={{ width: 120 }} onChange={(value) => { set_xyvalue(prevstate => ({ ...prevstate, Y: value })) }}>
                                {columns.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                                <Option value="Select Y-Column" disabled>
                                    Select Y-Column
                                </Option>
                            </Select>
                        </>
                    }
                </>
            }

            
            
            <div ref={userpdfref} id="user_charts" style={{ margin: "10%" }}></div>
            {Visualize_data && pdf_button &&
                <>
                
                <ReactToPdf targetRef={userpdfref} filename="User Charts.pdf" options={options} x={1} y={2}>
                    {({toPdf}) => (
                        <Button onClick={toPdf}>Generate pdf</Button>
                    )}
                </ReactToPdf>
                </>
            }

            <div ref={pdfref} id="charts"></div>
            {Visualize_data &&
                <>
                
                <ReactToPdf targetRef={pdfref} filename="Default Charts.pdf" options={options} y={2}>
                    {({toPdf}) => (
                        <Button onClick={toPdf}>Generate pdf</Button>
                    )}
                </ReactToPdf>
                </>
            }
            
            
            
        </div>
    )
}
