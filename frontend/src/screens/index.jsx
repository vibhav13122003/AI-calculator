import { useRef, useState, useEffect } from "react";
import {
  ActionIcon,
  Drawer,
  Group,
  ColorSwatch,
  Slider,
  ColorInput,
  } from "@mantine/core";
import { Button } from "../components/button";
import axios from "axios";
import Draggable from "react-draggable";
import { SWATCHES } from "../constant";
import {
  IconMenu2,
  IconDownload,
  IconHelp,
  IconFriends,
  IconPhotoCheck,
  IconBrandGithub,
  IconZoomIn,
  IconZoomOut,
  IconPencil, // Import additional icons as needed
  IconTypography, // Placeholder for text icon
  IconEraser,
  IconCircle, // Placeholder for circle icon
  IconLine, // Placeholder for line icon
  IconOval,
  IconRectangle,
} from "@tabler/icons-react";

export default function Home() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("rgb(255, 255, 255)");
  const [reset, setReset] = useState(false);
  const [dictOfVars, setDictOfVars] = useState({});
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [result, setResult] = useState();
  const [latexPosition, setLatexPosition] = useState({ x: 10, y: 200 });
  const [latexExpression, setLatexExpression] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("black");
  const [menuOpened, setMenuOpened] = useState(false);
  const [canvasImage, setCanvasImage] = useState(null);
  const [tool, setTool] = useState("pen");

  const [isTextActive, setIsTextActive] = useState(false);  
  const [currentText, setCurrentText] = useState("");

  const [eraserSize, setEraserSize] = useState(10); 
  const [shapes, setShapes] = useState([]);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [canvasBuffer, setCanvasBuffer] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (latexExpression.length > 0 && window.MathJax) {
      setTimeout(() => {
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
      }, 0);
    }
  }, [latexExpression]);

  useEffect(() => {
    if (result) {
      renderLatexToCanvas(result.expression, result.answer);
    }
  }, [result]);

  useEffect(() => {
    if (reset) {
      resetCanvas();
      setLatexExpression([]);
      setResult(undefined);
      setDictOfVars({});
      setReset(false);
    }
  }, [reset]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvasImage) {
        const img = new Image();
        img.src = canvasImage;
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
      }
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - canvas.offsetTop;
        ctx.lineCap = "round";

        ctx.lineWidth = strokeWidth;

        canvas.style.background = backgroundColor;
      }
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-MML-AM_CHTML";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
          ],
        },
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [backgroundColor, strokeWidth, canvasImage]); // Update canvas when backgroundColor changes

  const renderLatexToCanvas = (expression, answer) => {
    const latex = `${expression} = ${answer}`;
    setLatexExpression([...latexExpression, latex]);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
         ctx.fillStyle = backgroundColor;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
      setShapes([]); 
      setCanvasImage(null);
      setIsDrawing(false);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
         if (tool === "text") {
           // Set the position for the text input
           setTextInputPosition({
             x: e.nativeEvent.offsetX,
             y: e.nativeEvent.offsetY,
           });
           setShowTextInput(true); // Show the text input when text tool is selected
           return;
         }

      if (ctx) {
        ctx.lineWidth = tool === "eraser" ? eraserSize : strokeWidth;
        ctx.strokeStyle = tool === "eraser" ? "white" : color;
        setCanvasBuffer(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setStartX(e.nativeEvent.offsetX);
        setStartY(e.nativeEvent.offsetY);
        setIsDrawing(true);
      }
    }
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvasBuffer) {
        ctx.putImageData(canvasBuffer, 0, 0); 

      }


        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;

        switch (tool) {
          case "pen": {
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            break;
          }

          case "eraser": {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = eraserSize;
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
            break;
          }

          case "circle": {
            const radius = Math.sqrt(
              Math.pow(e.nativeEvent.offsetX - startX, 2) +
                Math.pow(e.nativeEvent.offsetY - startY, 2)
            );
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderShapesToCanvas();

            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
            break;
          }

          case "line": {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderShapesToCanvas();
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            break;
          }

          case "ellipse": {
            const radiusX = Math.abs(e.nativeEvent.offsetX - startX) / 2;
            const radiusY = Math.abs(e.nativeEvent.offsetY - startY) / 2;
            const centerX = (e.nativeEvent.offsetX + startX) / 2;
            const centerY = (e.nativeEvent.offsetY + startY) / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderShapesToCanvas();
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.stroke();
            break;
          }

          case "rectangle": {
            const width = e.nativeEvent.offsetX - startX;
            const height = e.nativeEvent.offsetY - startY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            renderShapesToCanvas();
            ctx.beginPath();
            ctx.rect(startX, startY, width, height);
            ctx.stroke();
            break;
          }

          case "text": {
            if (!isTextActive) return;

            // Display an input box at the click position
            const input = document.createElement("input");
            input.type = "text";
            input.style.position = "absolute";
            input.style.left = `${e.nativeEvent.offsetX}px`;
            input.style.top = `${e.nativeEvent.offsetY}px`;
            input.style.fontSize = "20px";
            input.style.backgroundColor = "transparent";
            input.style.color = color;
            input.style.border = "none";
            input.style.outline = "none";
            input.style.zIndex = "9999";
            input.setAttribute("autofocus", true); // Automatically focus the input

            document.body.appendChild(input);

            input.onkeydown = (event) => {
              if (event.key === "Enter") {
                // Draw the text on the canvas when "Enter" is pressed
                ctx.fillStyle = color;
                ctx.font = "20px Arial";
                ctx.fillText(
                  input.value,
                  e.nativeEvent.offsetX,
                  e.nativeEvent.offsetY
                );

                const textShape = {
                  type: "text",
                  text: input.value,
                  x: e.nativeEvent.offsetX,
                  y: e.nativeEvent.offsetY,
                  color,
                };
                setShapes([...shapes, textShape]); // Save the text to the shapes array

                // Remove the input box after the text is added to the canvas
                document.body.removeChild(input);
                setIsTextActive(false);
              }
            };

            break;
          }

          default: {
            console.log("Unknown tool selected");
            break;
          }
        }
      }
    }
  };

 const stopDrawing = () => {
   setIsDrawing(false);
   const canvas = canvasRef.current;
   const ctx = canvas.getContext("2d");

   const updatedCanvasBuffer = ctx.getImageData(
     0,
     0,
     canvas.width,
     canvas.height
   );
   setShapes([...shapes, updatedCanvasBuffer]);
   setCanvasBuffer(updatedCanvasBuffer);

   if (tool === "text") {
     ctx.fillText(currentText, startX, startY);
     const textShape = {
       type: "text",
       text: currentText,
       x: startX,
       y: startY,
       color: color,
     };
     setShapes([...shapes, textShape]);
     setIsTextActive(false);
   }
 };


  const renderShapesToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    shapes.forEach((shape) => {
      if (shape.type === "text") {
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.x, shape.y);
      } else {
        ctx.putImageData(shape, 0, 0);
      }
    });
  };
  const renderEraserSizeControl = () => (
    <div>
      <h3>Eraser Size</h3>
      <Slider
        mt='5px'
        w='120px'
        value={eraserSize}
        onChange={setEraserSize}
        min={1}
        max={500}
        step={5}
        radius='lg'
        size='lg'
      />
    </div>
  );

  const runRoute = async () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const response = await axios({
        method: "post",
        url: "https://ai-cal-iota.vercel.app/calculate",
        data: {
          image: canvas.toDataURL("image/png"),
          dict_of_vars: dictOfVars,
        },
      });

      const resp = await response.data;
      console.log("Response", resp);
      resp.data.forEach((data) => {
        if (data.assign === true) {
          setDictOfVars({
            ...dictOfVars,
            [data.expr]: data.result,
          });
        }
      });

      const ctx = canvas.getContext("2d");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let minX = canvas.width,
        minY = canvas.height,
        maxX = 0,
        maxY = 0;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          if (imageData.data[i + 3] > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      setLatexPosition({ x: centerX, y: centerY });
      resp.data.forEach((data) => {
        setTimeout(() => {
          setResult({
            expression: data.expr,
            answer: data.result,
          });
        }, 1000);
      });
    }
  };

  const handleImageUpload = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const file = e.target.files[0];

    if (file) {
      console.log("Selected file:", file);
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
          console.log("Image loaded successfully");
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);

      
          const aspectRatio = img.width / img.height;
          const canvasAspectRatio = canvas.width / canvas.height;

          if (aspectRatio > canvasAspectRatio) {
           
            const newWidth = canvas.width;
            const newHeight = newWidth / aspectRatio;
            ctx.drawImage(
              img,
              0,
              (canvas.height - newHeight) / 2,
              newWidth,
              newHeight
            );
          } else {
           
            const newHeight = canvas.height;
            const newWidth = newHeight * aspectRatio;
            ctx.drawImage(
              img,
              (canvas.width - newWidth) / 2,
              0,
              newWidth,
              newHeight
            );
          }
        };

        img.onerror = function () {
          console.error("Failed to load image");
        };
      };

      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected");
    }
  };


  const renderToolOptions = () => (
    <>
      <ActionIcon title='Pen' onClick={() => setTool("pen")}>
        <IconPencil />
      </ActionIcon>
      <ActionIcon title='Text' onClick={() => {
        setIsTextActive(true);
        setTool("text")}}>
        <IconTypography />
      </ActionIcon>
      <ActionIcon title='Circle' onClick={() => setTool("circle")}>
        <IconCircle />
      </ActionIcon>
      <ActionIcon title='Line' onClick={() => setTool("line")}>
        <IconLine />
      </ActionIcon>
      <ActionIcon title='Ellipse' onClick={() => setTool("ellipse")}>
        <IconOval />
      </ActionIcon>
      <ActionIcon title='Eraser' onClick={() => setTool("eraser")}>
        <IconEraser />
      </ActionIcon>
      <ActionIcon title='Rectangle' onClick={() => setTool("rectangle")}>
        <IconRectangle />
      </ActionIcon>

      {tool === "eraser" && renderEraserSizeControl()}
    </>
  );

  return (
    <>
      {/* Header Section */}

      <div className='absolute top-4 left-1/3  z-30 flex items-center gap-2 p-2 bg-gray-800 rounded justify-center '>
        {renderToolOptions()}
      </div>

      {/* Hamburger Menu Button */}
      <ActionIcon
        onClick={() => setMenuOpened((o) => !o)}
        className='absolute top-4 left-4 z-20'
        size='lg'
      >
        <IconMenu2 />
      </ActionIcon>

      {/* Hamburger Drawer Menu */}
      <div>
        <Drawer
          opened={menuOpened}
          onClose={() => setMenuOpened(false)}
          title='Options'
          position='left'
          size='180px'
          padding='md'
          offset={10}
          radius='md'
          className='text-gray-900'
          transitionProps={{
            transition: "pop-top-left",
            duration: 150,
            timingFunction: "ease",
          }}
          overlayProps={{ backgroundOpacity: 0.5, blur: 6 }}
        >
          <div className='grid gap-4 bg-inherit'>
            <Button
              size='md'
              color='blue'
              className='hover:bg-blue-600 bg-inherit border-blue-600'
            >
              <IconDownload />
              Save
            </Button>
            <Button
              size='md'
              variant='filled'
              color='green'
              className='hover:bg-green-600 bg-inherit border-green-600'
            >
              <IconHelp />
              Help
            </Button>
            <Button
              size='md'
              variant='filled'
              color='orange'
              className='hover:bg-orange-600 bg-inherit border-orange-600'
            >
              <IconFriends />
              Collaboration
            </Button>
            <Button
              size='md'
              variant='filled'
              color='violet'
              onClick={() => document.getElementById("file-input").click()}
              className='hover:bg-violet-600 bg-inherit border-violet-600'
            >
              <IconPhotoCheck />
              Import Image
            </Button>
            <input
              id='file-input'
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: "none" }} // Hide the input
            />

            <Button
              size='md'
              variant='filled'
              color='gray'
              className='hover:bg-gray-700 bg-inherit border-gray-700'
            >
              <IconBrandGithub />
              GitHub
            </Button>
          </div>
        </Drawer>
      </div>

      {/* Second Sidebar (Always on display) */}
      <div
        className='absolute left-4 top-[70px] w-[150px] h-[70%] bg-gray-800 text-white p-2'
        style={{ zIndex: 15 }}
      >
        <Group direction='column'>
          <Group spacing='sm'>
            <ActionIcon size='lg'>
              <IconZoomIn />
            </ActionIcon>
            <ActionIcon size='lg'>
              <IconZoomOut />
            </ActionIcon>
          </Group>
          <div>
            <h3>Background Color</h3>
            <Group spacing='xs'>
              {SWATCHES.map((swatch) => (
                <ColorSwatch
                  key={swatch}
                  color={swatch}
                  onClick={() => setBackgroundColor(swatch)}
                />
              ))}
              <div>
                <ColorInput
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                  placeholder='Pick color'
                  format='rgba'
                  withEyeDropper={false}
                  pointer={true}
                  radius='lg'
                />
              </div>
            </Group>
          </div>
          <div>
            <h3>Stroke Color</h3>
            <Group spacing='xs'>
              {SWATCHES.map((swatch) => (
                <ColorSwatch
                  key={swatch}
                  color={swatch}
                  onClick={() => setColor(swatch)}
                />
              ))}
              <ColorInput
                value={color}
                onChange={setColor}
                placeholder='Pick color'
                format='rgba'
                withEyeDropper={false}
                pointer={true}
                radius='lg'
              />
            </Group>
          </div>
          <div>
            <h2>Stroke Width</h2>
            <Slider
              mt='5px'
              w='120px'
              value={strokeWidth}
              onChange={setStrokeWidth}
              min={1}
              max={20}
              step={2}
              radius='lg'
              size='lg'
            />

            {showTextInput && (
              <input
                type='text'
                placeholder=''
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                style={{
                  position: "absolute",
                  top: textInputPosition.y,
                  left: textInputPosition.x,
                  fontSize: "20px",
                  backgroundColor: "transparent",
                  color: color,
                  border: "none",
                  outline: "none",
                  zIndex: 9999,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const ctx = canvasRef.current.getContext("2d");
                    ctx.fillStyle = color;
                    ctx.font = "20px Arial";
                    ctx.fillText(
                      currentText,
                      textInputPosition.x,
                      textInputPosition.y
                    );
                    setShapes([
                      ...shapes,
                      {
                        type: "text",
                        text: currentText,
                        x: textInputPosition.x,
                        y: textInputPosition.y,
                        color,
                      },
                    ]);
                    setCurrentText("");
                    setShowTextInput(false); // Hide input after adding text
                  }
                }}
              />
            )}
          </div>
        </Group>
      </div>

      <canvas
        ref={canvasRef}
        id='canvas'
        className='w-screen h-screen absolute inset-0'
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
      {latexExpression &&
        latexExpression.map((latex, index) => (
          <Draggable
            key={index}
            defaultPosition={latexPosition}
            onStop={(e, data) => setLatexPosition({ x: data.x, y: data.y })}
          >
            <div className='absolute p-4 text-gray-900 bg-white rounded-lg shadow-lg border border-gray-300'>
              <div className='latex-content font-bold whitespace-normal leading-relaxed'>
                {latex.split(" ").map((word, wordIndex) => (
                  <span key={wordIndex} className='mr-2'>
                    {" "}
                    {/* Adds right margin */}
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </Draggable>
        ))}

      <Button
        onClick={runRoute}
        style={{ backgroundColor: "green" }}
        className='absolute right-4 bottom-4 z-20'
        variant='default'
        size='lg'
      >
        Run
      </Button>

      {/* "Reset" button at the bottom left */}
      <Button
        onClick={() => setReset(true)}
        style={{ backgroundColor: "rgb(209,0,5)" }}
        className='absolute left-4 bottom-4 z-20'
        variant='default'
        size='lg'
      >
        Reset
      </Button>
    </>
  );
}
