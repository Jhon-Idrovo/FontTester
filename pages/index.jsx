import Head from "next/head";
import { useEffect, useState } from "react";

import TextArea from "../components/TextArea";
import LikedFonts from "../components/LikedFonts";
import Loading from "../components/Loading";

import useUser from "../hooks/useUser";
import { useQuery } from "react-query";

import { blacklistFont, getBlacklistedFonts } from "../lib/firebaseUser";
import CategoryFilter from "../components/CategoryFilter";
import { fetchFontsList } from "../lib/utils";
import useBlacklistedFonts from "../hooks/useBlacklistedFonts";

export default function Home() {
  //fetch google fonts
  const {
    data: fonts,
    error,
    isLoading: isLoadingFonts,
  } = useQuery("fonts", fetchFontsList);
  //--------------------TEXT AREAS ----------------
  const { user, logOut, isLoadingUser } = useUser();
  //once the user is loaded (if there's one, we need its blacklisted fonts)
  const {
    error: blFontsError,
    fonts: blFonts,
    isLoading: isLoadignBlFonts,
  } = useBlacklistedFonts();
  const [texts, setTexts] = useState([
    { fontIndex: 0, filters: blFonts ? blFonts : [] },
    { fontIndex: 0, filters: blFonts ? blFonts : [] },
  ]);
  const [activeTextIndex, setActiveTextIndex] = useState(0);
  //changes can be -1 or 1
  /**
   * Get the next font, compare it againt the filters, if valid, apply it setting the value
   * of the active text area to the new font.
   * Otherwise make a recursive call to handleFontChange with a change of +2.
   * @param {-1 or 1} change Only in the case of recursive calls the value of change will be 2
   */
  const handleFontChange = (change) => {
    setTexts((texts) => {
      const currentText = texts[activeTextIndex];
      const nextFont = fonts[currentText.fontIndex + change];
      const nextFontIndex = currentText.fontIndex + change;
      //check for negative index
      if (nextFontIndex < 0) {
        return texts;
      }
      //check if the font meets the restrictions
      if (
        currentText.filters.includes(nextFont.category) ||
        currentText.filters.includes(nextFontIndex)
      ) {
        //if the font is excluded execute the chenge again. To do this wee need to
        //make the change two times.
        //First we need to let the setTexts function call terminate.
        //To do this without killing the recursive call, we use a setTimeot to
        //take the call out of the tread.
        setTimeout(() => {
          handleFontChange(change * 2);
        }, 0);
        return texts;
      }
      texts[activeTextIndex].fontIndex = nextFontIndex;
      //to force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
  };
  /**
   * Removes or adds the category to the active text area filters accordingly
   * @param {string} category one of the 5 google font categories
   */
  const handleCategoryFilter = (category) => {
    //add the category to the filters array on the texts variable if it's in it. Otherwise
    //remove it
    setTexts((texts) => {
      const activeTextFilters = texts[activeTextIndex].filters;
      activeTextFilters.includes(category)
        ? activeTextFilters.splice(activeTextFilters.indexOf(category), 1)
        : activeTextFilters.push(category);
      //force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
  };
  //BLACKLIST FONT
  /**
   * Put the font on the filters. If the user is pro
   * blacklist the font asynchronously on the server too
   */
  function doNotShowFont() {
    setTexts((texts) => {
      texts[activeTextIndex].filters = [
        ...texts[activeTextIndex].filters,
        texts[activeTextIndex].fontIndex,
      ];
      //if the user is PRO blacklist the font on the server too
      if (user?.subscriptionType === "PRO") {
        const font = fonts[texts[activeTextIndex].fontIndex];
        blacklistFont(font, user);
      }
      //to force re-rendering
      return JSON.parse(JSON.stringify(texts));
    });
    //advance to the next font
    handleFontChange(+1);
  }

  //SAVE AND SHOW LIKED FONTS
  const [liked, setLiked] = useState([]);
  const saveFonts = () => {
    //save the current font(s) when "SAVE THIS" is pressed
    setLiked((prev) => [...prev, texts.map((t) => fonts[t.fontIndex].family)]);
  };
  const handleRemoveFont = (likedIndex) => {
    setLiked((prev) => {
      prev.splice(likedIndex, 1);
      return JSON.parse(JSON.stringify(prev));
    });
  };
  const [isShowingLiked, setIsShowingLiked] = useState(false);
  const handleShowLiked = async () => {
    setIsShowingLiked(true);
  };

  //TEXTS CONFIG
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [config, setConfig] = useState({ bgCol: "#FFFFFF", txtCol: "#000000" });
  const handleConfigSubmit = (e) => {
    e.preventDefault();
    console.log(e);
    const txtCol = e.target[0].value;
    const bgCol = e.target[1].value;
    setConfig({ bgCol, txtCol });
  };
  useEffect(() => {
    function clickOutsideHandler(e) {
      if (
        e.currentTarget.id !== "config-menu" &&
        e.currentTarget.id !== "config-menu-btn"
      ) {
        setIsConfigOpen(false);
      }
    }
    document.addEventListener("click", clickOutsideHandler);
    return () => {
      document.removeEventListener("click", clickOutsideHandler);
    };
  }, []);
  const [isFullScreen, setIsFullScreen] = useState(false);

  //SETTING UP LISTENERS FOR THE KEYS
  const handleKeyPress = (e) => {
    const { key } = e;
    key === "ArrowUp" ? doNotShowFont() : null;
    key === "ArrowDown" ? saveFonts() : null;
    key === "ArrowLeft" ? handleFontChange(-1) : null;
    key === "ArrowRight" ? handleFontChange(+1) : null;
  };
  useEffect(() => {
    //suscribe to the events
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      //unsuscribe to the events
      document.removeEventListener("keydown", handleKeyPress);
    };
    //dependency to not set an static active index
  }, [activeTextIndex]);
  if (isLoadingUser) {
    return (
      <main className="w-screen h-screen">
        <Loading>
          <p className="text-txt-base">Loading data</p>
        </Loading>
      </main>
    );
  }
  return (
    <>
      <Head>
        <title>FindAFont</title>
        {fonts?.map(({ family }) => (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css?family=${family}`}
          />
        ))}
      </Head>
      {isShowingLiked ? (
        <LikedFonts
          fonts={liked}
          goBack={() => setIsShowingLiked(false)}
          handleRemoveFont={handleRemoveFont}
        />
      ) : (
        <main className="fixed top-10 bottom-0 right-0 left-0 text-txt-base bg-base">
          <div className="absolute top-6 w-full flex flex-col items-center">
            <button onClick={doNotShowFont} className="flex items-center">
              DON'T SHOW AGAIN
              <svg
                className="keyboard-icon"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 377.343 377.343"
              >
                <g>
                  <path
                    d="M301.689,53.505H75.651c-10.876,0-19.725,8.843-19.725,19.713v230.904c0,10.878,8.843,19.727,19.725,19.727h226.039
		c10.873,0,19.722-8.843,19.722-19.727V73.218C321.406,62.348,312.562,53.505,301.689,53.505z M199.166,148.409
		c-0.82,1.102-2.289,1.513-3.573,1.009l-38.281-15.124v88.612c0,1.686-1.365,3.076-3.064,3.065h-30.679
		c-1.691,0-3.059-1.38-3.07-3.075l0.011-88.598l-38.282,15.114c-1.282,0.503-2.739,0.087-3.572-1.01
		c-0.838-1.103-0.838-2.615,0.01-3.721l57.804-75.185c0.583-0.755,1.492-1.193,2.438-1.193c0.952-0.01,1.856,0.438,2.433,1.193
		l57.804,75.191c0.432,0.561,0.643,1.229,0.637,1.871C199.779,147.21,199.579,147.854,199.166,148.409z M338.677,0H38.662
		C19.094,0,3.226,15.869,3.226,35.434v306.462c0,19.581,15.869,35.447,35.437,35.447h300.02c19.568,0,35.436-15.866,35.436-35.447
		V35.434C374.117,15.869,358.25,0,338.677,0z M335.381,304.122c0,18.572-15.113,33.691-33.691,33.691H75.651
		c-18.576,0-33.695-15.114-33.695-33.691V73.218c0-18.569,15.114-33.688,33.695-33.688h226.039
		c18.572,0,33.691,15.114,33.691,33.688V304.122z"
                  />
                </g>
              </svg>
            </button>
          </div>
          <button
            onClick={() => handleFontChange(-1)}
            className="absolute top-1/2 left-2 key-btn-col"
          >
            PREVIOUS
            <svg
              className="keyboard-icon"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 377.338 377.338"
            >
              <g>
                <path
                  d="M301.688,53.505H75.648c-10.875,0-19.724,8.843-19.724,19.713v230.904c0,10.873,8.843,19.722,19.724,19.722h226.04
		c10.873,0,19.722-8.844,19.722-19.722V73.218C321.403,62.348,312.561,53.505,301.688,53.505z M78.585,134.592l75.189-57.792
		c0.561-0.438,1.224-0.646,1.873-0.646c0.64,0,1.289,0.208,1.843,0.624c1.104,0.81,1.519,2.284,1.015,3.568l-15.124,38.282h88.599
		c1.69,0,3.081,1.368,3.063,3.065v30.679c0.006,1.688-1.373,3.053-3.069,3.064l-88.6-0.011l15.12,38.285
		c0.502,1.28,0.086,2.746-1.015,3.578c-1.106,0.831-2.62,0.831-3.717-0.011l-75.178-57.817c-0.756-0.588-1.2-1.488-1.2-2.44
		C77.385,136.064,77.834,135.168,78.585,134.592z M338.675,0H38.66C19.093,0,3.223,15.869,3.223,35.434v306.462
		c0,19.573,15.87,35.442,35.437,35.442h300.019c19.569,0,35.437-15.869,35.437-35.442V35.434C374.115,15.869,358.248,0,338.675,0z
		 M335.379,304.122c0,18.572-15.113,33.691-33.691,33.691H75.648c-18.574,0-33.694-15.114-33.694-33.691V73.218
		c0-18.569,15.114-33.688,33.694-33.688h226.04c18.572,0,33.691,15.114,33.691,33.688V304.122z"
                />
              </g>
            </svg>
          </button>
          <button
            onClick={() => handleFontChange(+1)}
            className="absolute top-1/2 right-6 key-btn-col"
          >
            NEXT
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              version="1.1"
              viewBox="0 0 377.338 377.338"
              className="keyboard-icon"
            >
              <g transform="matrix(-1,0,0,1,377.339035987854,0)">
                <g xmlns="http://www.w3.org/2000/svg">
                  <path d="M301.688,53.505H75.648c-10.875,0-19.724,8.843-19.724,19.713v230.904c0,10.873,8.843,19.722,19.724,19.722h226.04   c10.873,0,19.722-8.844,19.722-19.722V73.218C321.403,62.348,312.561,53.505,301.688,53.505z M78.585,134.592l75.189-57.792   c0.561-0.438,1.224-0.646,1.873-0.646c0.64,0,1.289,0.208,1.843,0.624c1.104,0.81,1.519,2.284,1.015,3.568l-15.124,38.282h88.599   c1.69,0,3.081,1.368,3.063,3.065v30.679c0.006,1.688-1.373,3.053-3.069,3.064l-88.6-0.011l15.12,38.285   c0.502,1.28,0.086,2.746-1.015,3.578c-1.106,0.831-2.62,0.831-3.717-0.011l-75.178-57.817c-0.756-0.588-1.2-1.488-1.2-2.44   C77.385,136.064,77.834,135.168,78.585,134.592z M338.675,0H38.66C19.093,0,3.223,15.869,3.223,35.434v306.462   c0,19.573,15.87,35.442,35.437,35.442h300.019c19.569,0,35.437-15.869,35.437-35.442V35.434C374.115,15.869,358.248,0,338.675,0z    M335.379,304.122c0,18.572-15.113,33.691-33.691,33.691H75.648c-18.574,0-33.694-15.114-33.694-33.691V73.218   c0-18.569,15.114-33.688,33.694-33.688h226.04c18.572,0,33.691,15.114,33.691,33.688V304.122z" />
                </g>
              </g>
            </svg>
          </button>
          <button
            onClick={saveFonts}
            className="absolute bottom-6 flex w-full justify-center items-center"
          >
            SAVE
            <svg
              className="keyboard-icon"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 377.343 377.343"
            >
              <g>
                <path
                  d="M301.689,53.505H75.651c-10.876,0-19.725,8.843-19.725,19.713v230.904c0,10.878,8.843,19.727,19.725,19.727h226.039
		c10.873,0,19.722-8.843,19.722-19.727V73.218C321.406,62.348,312.562,53.505,301.689,53.505z M192.235,150.98l-57.806,75.188
		c-0.584,0.757-1.49,1.197-2.438,1.197c-0.952,0.007-1.853-0.44-2.43-1.197L71.762,150.98c-0.432-0.561-0.646-1.22-0.64-1.871
		c0-0.637,0.203-1.289,0.616-1.844c0.818-1.102,2.288-1.519,3.57-1.013l38.282,15.123V72.769c0-1.69,1.368-3.081,3.064-3.064h30.679
		c1.691-0.005,3.059,1.374,3.07,3.07l-0.012,88.601l38.278-15.117c1.282-0.507,2.738-0.091,3.575,1.012
		C193.085,148.37,193.085,149.883,192.235,150.98z M338.677,0H38.662C19.094,0,3.226,15.869,3.226,35.434v306.462
		c0,19.581,15.869,35.447,35.437,35.447h300.02c19.568,0,35.436-15.866,35.436-35.447V35.434C374.117,15.869,358.25,0,338.677,0z
		 M335.381,304.122c0,18.572-15.113,33.691-33.691,33.691H75.651c-18.576,0-33.695-15.114-33.695-33.691V73.218
		c0-18.569,15.114-33.688,33.695-33.688h226.039c18.572,0,33.691,15.114,33.691,33.688V304.122z"
                />
              </g>
            </svg>
          </button>
          <button
            onClick={handleShowLiked}
            className="absolute bottom-8 w-max right-4 btn py-2 px-4"
          >
            Next
          </button>
          <div
            className={`flex flex-col absolute overflow-y-scroll ${
              isFullScreen
                ? "top-0 bottom-0 right-0 left-0 z-10"
                : "top-16 bottom-16 right-24 left-24"
            } bg-base border-2 border-txt-base`}
          >
            <div className="flex justify-end mx-1 my-0">
              <CategoryFilter
                filters={texts[activeTextIndex].filters}
                handleCategoryFilter={handleCategoryFilter}
              />
              <button
                onClick={() => setIsConfigOpen((prev) => !prev)}
                className="mx-1"
                id="config-menu-btn"
              >
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <ul
                id="config-menu"
                className={`absolute top-6 right-0 overflow-hidden transition-all bg-base ${
                  isConfigOpen ? "max-h-screen" : "max-h-0"
                }`}
              >
                <li>
                  <form
                    onSubmit={handleConfigSubmit}
                    className="flex flex-col p-2"
                  >
                    <label htmlFor="font-color-picker">Font Color</label>

                    <input type="color" id="font-color-picker" name="txtCol" />
                    <label htmlFor="bg-color-picker">Background Color</label>

                    <input type="color" id="bg-color-picker" name="bgCol" />
                    <button className="btn px-2 mt-2">Save</button>
                  </form>
                </li>
              </ul>
              <button
                onClick={() => {
                  setIsFullScreen((prev) => !prev);
                }}
              >
                {isFullScreen ? (
                  <i className="fas fa-compress-arrows-alt"></i>
                ) : (
                  <i className="fas fa-expand-arrows-alt"></i>
                )}
              </button>
            </div>
            {!isLoadingFonts ? (
              texts.map((t, index) => (
                <TextArea
                  key={index}
                  config={config}
                  index={index}
                  font={fonts[t.fontIndex]}
                  setActive={setActiveTextIndex}
                />
              ))
            ) : (
              <Loading>
                <p>Loading fonts</p>
              </Loading>
            )}
          </div>
        </main>
      )}
    </>
  );
}
