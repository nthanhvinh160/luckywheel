import React, { useState, useEffect } from "react";
import WheelComponent from "./weel";
import "./styles.css";
import IMAGES from "./assets";
import TrPortal from "./portal";
import Confetti from "react-confetti";
import { Input } from "semantic-ui-react";
import unidecode from "unidecode";
const App = () => {
  const [portal, setPortal] = useState(false);
  const [show, setShow] = useState(false);
  const [segments, setSegments] = useState([]);
  const [orderOfNames, setorderOfNames] = useState(["tiên", "phi", "hải", "tú", "thảo", "phú", "thúy anh", "lan anh"]);
  const [keyword, setKeyword] = useState('');
  const [winningSegment, setwinningSegment] = useState(null);
  const [indexOrder, setindexOrder] = useState(0);

  useEffect(() => {
    // Reload logic here when segments change

  }, [segments, indexOrder, winningSegment, orderOfNames]);

  const weelColors = () => {
    let arr = [];
    let colors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F"];
    segments.forEach((el) => {
      let color = colors.shift();
      arr.push(color);
      colors.push(color);
    });

    return arr;
  };

  const segColors = weelColors();

  const onFinished = (e) => {
    let winner;

    if (segments.length > 0) {
      let indexOfName;
      if (e) { indexOfName = orderOfNames.indexOf(e.toLowerCase()); }
      console.log(indexOfName);
      if (indexOfName !== -1) {
        winner = segments.find(name => {
          const lowerCaseName = name ? unidecode(name.toLowerCase()) : null;
          if (lowerCaseName === unidecode(orderOfNames[0].toLowerCase())) {
            let updatedOrder = orderOfNames.filter(item => unidecode(item.toLowerCase()) !== unidecode(lowerCaseName));
            setorderOfNames(updatedOrder);
            setwinningSegment(name);
            return name;
          }
        });
      } else {
        setorderOfNames(["tiên", "phi", "hải", "tú", "thảo", "phú", "lan anh", "thúy anh"])
        setwinningSegment(e)
        winner = e;
      }
    } else {
      // Xử lý khi hết phần tử trong segments
      console.log("NO elements!");
      setwinningSegment(null); // Hoặc giá trị khác để chỉ ra trạng thái không có phần tử nào trúng thưởng
    }

    setPortal(false);
    setShow(winner);
  };

  const handleOk = () => {
    let updatedSegments;
    if (segments.length > 0) {
      updatedSegments = segments.filter(name => unidecode(name.toLowerCase()) !== unidecode(winningSegment.toLowerCase()));
    }
    setSegments(updatedSegments);
    setShow(false);
  }

  const addName = () => {
    if (keyword.trim() !== "") {
      setSegments([...segments, keyword.toUpperCase()]);
      setKeyword('');
    }
  };
  const deleteItem = (item) => {
    const updatedSegments = segments.filter(name => name.toLowerCase() !== item.toLowerCase());
    setSegments(updatedSegments);
  };

  const handleKeyPress = (e) => {
    // Handle Enter key press
    if (e.key === "Enter") {
      addName();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "150px",
        paddingBottom: "150px",
        height: "100vh",
        background: `url(${IMAGES.background})`,
      }}
    >
      {show && <Confetti width={1600} height={1019} />}
      <WheelComponent
        key={segments.join(",")} // Use key to force component to reload
        segments={segments}
        segColors={segColors}
        winningSegment={winningSegment}
        onFinished={onFinished}
        primaryColor="gray"
        contrastColor="white"
        buttonText="Click để quay"
        isOnlyOnce={true}
      />
      <div style={{ marginLLeft: '100px' }}>
        <Input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyPress={handleKeyPress} />
        <button className="addName" onClick={addName}>
          Thêm tên
        </button>
        <div className="listName">
          {segments.length > 0 && segments.map(item => (<>
            <div className="rowName">
              <h5> {item} </h5>
              <button className="deleteName" onClick={() => deleteItem(item)}>
                Xóa
              </button>
            </div>
          </>))}
        </div>
      </div>
      {portal && <TrPortal />}
      {show && (
        <div className="box">
          <h2 className="titleWin" style={{ textAlign: "center" }}>
            CHÚC MỪNG {show} !!!
          </h2>
          <div className="closeContainer">
            <button className="closepankaj" onClick={() => handleOk()}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
