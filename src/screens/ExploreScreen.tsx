import React, { useEffect, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useExploreState } from "context/exploreContext";
import orderBy from "lodash/orderBy";
import common from "styles/common";
import SpacePreview from "components/SpacePreview";
import i18n from "i18n-js";
import ExploreHeader from "components/explore/ExploreHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFilteredSpaces } from "helpers/searchUtils";
import { useAuthState } from "context/authContext";

function ExploreScreen() {
  const { colors } = useAuthState();
  const insets = useSafeAreaInsets();
  const { spaces } = useExploreState();
  const [filteredExplore, setFilteredExplore] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentExplore, setCurrentExplore] = useState<{
    key: string;
    text: string;
  }>({
    key: "spaces",
    text: i18n.t("spaces"),
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const orderedSpaces = useMemo(() => {
    const list = Object.keys(spaces)
      .map((key) => {
        return {
          id: key,
          ...spaces[key],
          followers: spaces[key].followers ?? 0,
          private: spaces[key].private ?? false,
        };
      })
      .filter((space) => !space.private);
    return orderBy(list, ["following", "followers"], ["desc", "desc"]);
  }, [spaces]);

  useEffect(() => {
    if (currentExplore.key === "spaces") {
      setFilteredExplore(
        getFilteredSpaces(orderedSpaces, searchValue, selectedCategory)
      );
    }
  }, [spaces, currentExplore, searchValue, selectedCategory]);

  return (
    <View
      style={[
        common.screen,
        { backgroundColor: colors.bgDefault, paddingTop: insets.top },
      ]}
    >
      <ExploreHeader
        searchValue={searchValue}
        onChangeText={(text: string) => {
          setSearchValue(text);
        }}
        currentExplore={currentExplore}
        setCurrentExplore={setCurrentExplore}
        filteredExplore={
          selectedCategory === "" ? orderedSpaces : filteredExplore
        }
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FlatList
        contentContainerStyle={{
          borderWidth: 1,
          borderColor: colors.borderColor,
          marginHorizontal: 14,
          borderRadius: 9,
          marginTop: 16,
        }}
        data={filteredExplore}
        renderItem={(data) => {
          if (currentExplore.key === "spaces") {
            return <SpacePreview space={data.item} />;
          }
          return <View />;
        }}
        keyExtractor={(item, i) => `${item.id}${i}`}
        onEndReachedThreshold={0.45}
        onEndReached={() => {}}
      />
    </View>
  );
}

export default ExploreScreen;
