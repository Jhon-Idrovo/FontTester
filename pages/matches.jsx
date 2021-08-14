import { useState, useEffect, useContext } from "react";
import { db } from "../lib/firebase";
import moduleName from "../components/SingIn";
import SingIn from "../components/SingIn";
import SubscriptionNeeded from "../components/SubscriptionNeeded";
import useCollections from "../hooks/useCollections";
import Head from "next/head";
function Matches() {
  const { collections, isError } = useCollections();
  return (
    <div>
      <Head>
        {collections?.map((collection) =>
          collection.fontFamilyNames.map((fontName) => (
            <link
              rel="stylesheet"
              href={`https://fonts.googleapis.com/css?family=${fontName}`}
            />
          ))
        )}
      </Head>
      {collections?.map((collection) => (
        <div>
          {collection.fontFamilyNames.map((fontName) => (
            <h2 className="text-txt-base" style={{ fontFamily: fontName }}>
              {fontName}
            </h2>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Matches;
