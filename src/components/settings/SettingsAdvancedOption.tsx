import React from "react";
import { Text, View } from "react-native";
import SettingsOption from "components/settings/SettingsOption";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import i18n from "i18n-js";
import {
  BOTTOM_SHEET_MODAL_ACTIONS,
  useBottomSheetModalDispatch,
} from "context/bottomSheetModalContext";
import common from "styles/common";
import { useAuthState } from "context/authContext";
import { hubUrl } from "helpers/snapshotClient";
import IconFont from "components/IconFont";
import settingsStyles from "styles/settings";

interface SettingsAdvancedOptionProps {
  goBack: () => void;
}

function SettingsAdvancedOption({ goBack }: SettingsAdvancedOptionProps) {
  const { colors } = useAuthState();
  const bottomSheetModalDispatch = useBottomSheetModalDispatch();
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        const snapPoint = 220;
        bottomSheetModalDispatch({
          type: BOTTOM_SHEET_MODAL_ACTIONS.SET_BOTTOM_SHEET_MODAL,
          payload: {
            scroll: false,
            TitleComponent: () => {
              return (
                <View
                  style={[
                    common.row,
                    common.alignItemsCenter,
                    common.justifySpaceBetween,
                    common.containerHorizontalPadding,
                  ]}
                >
                  <TouchableWithoutFeedback onPress={goBack}>
                    <View style={{ marginTop: 16 }}>
                      <IconFont
                        name={"back"}
                        size={30}
                        color={colors.textColor}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <Text
                    style={[common.modalTitle, { color: colors.textColor }]}
                  >
                    {i18n.t("advanced")}
                  </Text>
                  <IconFont name={"back"} size={30} color={"transparent"} />
                </View>
              );
            },
            ModalContent: () => {
              return (
                <View style={common.containerHorizontalPadding}>
                  <SettingsOption
                    title={i18n.t("ipfsUrl")}
                    iconName="upload"
                    valueTitle={"cloudflare-ipfs.com"}
                  />
                  <View
                    style={[
                      settingsStyles.separator,
                      { backgroundColor: colors.borderColor },
                    ]}
                  />
                  <SettingsOption
                    iconName={"snapshot"}
                    title={i18n.t("hub")}
                    valueTitle={hubUrl}
                  />
                </View>
              );
            },
            options: [],
            snapPoints: [10, snapPoint],
            show: true,
            key: "view-settings-about",
            icons: [],
            initialIndex: 1,
          },
        });
      }}
    >
      <SettingsOption title={i18n.t("advanced")} iconName="menu" />
    </TouchableWithoutFeedback>
  );
}
export default SettingsAdvancedOption;
