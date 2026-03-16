import React from "react";
import styled from "styled-components";

const ModeToggle = ({ mode, setMode }) => {
    return (
        <StyledWrapper>
            <div className="glass-radio-group mt-1">
                <input
                    type="radio"
                    name="learning-mode"
                    id="crisp"
                    checked={mode === "crisp"}
                    onChange={() => setMode("crisp")}
                />
                <label htmlFor="crisp">Crisp</label>

                <input
                    type="radio"
                    name="learning-mode"
                    id="conceptual"
                    checked={mode === "conceptual"}
                    onChange={() => setMode("conceptual")}
                />
                <label htmlFor="conceptual">Conceptual</label>

                <input
                    type="radio"
                    name="learning-mode"
                    id="comprehensive"
                    checked={mode === "comprehensive"}
                    onChange={() => setMode("comprehensive")}
                />
                <label htmlFor="comprehensive">Comprehensive</label>

                <div className="glass-glider" />
            </div>
        </StyledWrapper>
    );
};



const StyledWrapper = styled.div`
  .glass-radio-group {
    --bg: rgb(0, 166, 255);
    --text: #9fd9ff;

    display: flex;
    position: relative;
    background: white;
    border-radius: 1rem;
    backdrop-filter: blur(12px);
    overflow: hidden;
    width: fit-content;
  }

  .glass-radio-group input {
    display: none;
  }

  .glass-radio-group label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    font-size: 14px;
    padding: 0.8rem 1.6rem;
    cursor: pointer;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--text);
    position: relative;
    z-index: 2;
    transition: color 0.3s ease-in-out;
  }

  .glass-radio-group label:hover {
    color: #cfefff;
  }

  .glass-radio-group input:checked + label {
    color: #004a73;
  }

  .glass-glider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: calc(100% / 3);
    border-radius: 1rem;
    background: var(--bg);
    z-index: 1;
    transition:
      transform 0.45s cubic-bezier(0.37, 1.95, 0.66, 0.56),
      background 0.35s ease-in-out,
      box-shadow 0.35s ease-in-out;
  }

  /* Crisp */
  #crisp:checked ~ .glass-glider {
    transform: translateX(0%);
    background: linear-gradient(135deg, #b3e3ff, #00a7ff);
    box-shadow:
      0 0 20px rgba(106, 203, 255, 0.55),
      0 0 10px rgba(255, 255, 255, 0.35) inset;
  }

  /* Conceptual */
  #conceptual:checked ~ .glass-glider {
    transform: translateX(100%);
    background: linear-gradient(135deg, #b3e3ff, #1ab3ff);
    box-shadow:
      0 0 20px rgba(0, 167, 255, 0.55),
      0 0 10px rgba(255, 255, 255, 0.35) inset;
  }

  /* Comprehensive */
  #comprehensive:checked ~ .glass-glider {
    transform: translateX(200%);
    background: linear-gradient(135deg, #b3e3ff, #0095e6);
    box-shadow:
      0 0 20px rgba(0, 167, 255, 0.55),
      0 0 10px rgba(255, 255, 255, 0.35) inset;
  }
`;


export default ModeToggle;
