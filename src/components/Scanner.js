import Quagga from "quagga";
import { useEffect, useState } from "react";
import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

export default function Scanner({ barreCode, setBarreCode }) {
  const [currentDevice, setCurrentDevice] = useState("user");

  const onHandleChange = (e) => {
    setCurrentDevice(e.target.value);
  };

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          constraints: {
            width: "640",
            height: "480",
            facingMode: currentDevice,
            aspectRatio: { min: 1, max: 2 },
          },
          numberOfWorkers: navigator.hardwareConcurrency,
          frequency: 10,
          target: document.querySelector("#quagga"),
        },
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: true,
          showPattern: true,
        },
        locator: {
          halfSample: true,
          patchSize: "medium", // x-small, small, medium, large, x-large
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
        area: {
          // defines rectangle of the detection/localization area
          top: "0%", // top offset
          right: "0%", // right offset
          left: "0%", // left offset
          bottom: "0%", // bottom offset
        },
        singleChannel: false,
        locate: true,
        decoder: {
          readers: ["ean_reader", "code_128_reader", "ean_8_reader"],
        },
      },
      function (err) {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );
    Quagga.onDetected((data) => {
      const { code } = data.codeResult;
      if (code && barreCode !== code) {
        setBarreCode(code);
      }
    });
    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    return () => {
      Quagga.stop();
      Quagga.offProcessed();
      Quagga.offDetected();
    };
  }, [currentDevice]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div id="quagga" style={{ margin: "auto" }}></div>
        <canvas
          className="drawingBuffer"
          style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
        ></canvas>
      </div>
      <FormControl component="fieldset" style={{ marginTop: "1.5rem" }}>
        <FormLabel component="legend">Switch camera</FormLabel>
        <RadioGroup
          aria-label="devices"
          name="devices"
          value={currentDevice}
          onChange={onHandleChange}
        >
          <FormControlLabel
            value="environment"
            control={<Radio />}
            label="Back"
          />
          <FormControlLabel value="user" control={<Radio />} label="Front" />
        </RadioGroup>
      </FormControl>
    </>
  );
}
