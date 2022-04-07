import React from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import colors from "constants/colors";
import { useAuthState } from "context/authContext";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import IconFont from "components/IconFont";

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowTitle: {
    color: colors.textColor,
    fontFamily: "Calibre-Semibold",
    fontSize: 18,
  },
});

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} pressBehavior="close" />
);

interface BottomSheetModalProps {
  bottomSheetRef: any;
  snapPoints: any[];
  options: string[];
  onPressOption: (index: number) => void;
  initialIndex: number;
  destructiveButtonIndex?: number;
  ModalContent?: React.FunctionComponent | undefined;
  scroll?: boolean;
  enablePanDownToClose?: boolean;
  BackDropRenderer?: any;
  icons?: { name: string; size?: number; color?: string }[];
  bottomSheetViewComponentProps?: any;
  TitleComponent?: React.FunctionComponent | undefined;
  bottomSheetProps?: any;
}

function BottomSheetModal({
  bottomSheetRef,
  snapPoints,
  options,
  onPressOption,
  initialIndex,
  destructiveButtonIndex,
  ModalContent,
  scroll = false,
  enablePanDownToClose = true,
  BackDropRenderer = undefined,
  icons = [],
  bottomSheetViewComponentProps = {},
  bottomSheetProps = {},
  TitleComponent = undefined,
}: BottomSheetModalProps) {
  const { colors } = useAuthState();
  let BottomSheetViewComponent: any = BottomSheetView;
  if (scroll) {
    BottomSheetViewComponent = BottomSheetScrollView;
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={enablePanDownToClose}
      animateOnMount
      backgroundStyle={{
        backgroundColor: colors.bgDefault,
      }}
      backdropComponent={
        BackDropRenderer !== undefined ? BackDropRenderer : renderBackdrop
      }
      index={initialIndex}
      handleIndicatorStyle={{ backgroundColor: colors.textColor }}
      onChange={(index) => {
        if (index < 0) {
          Keyboard?.dismiss();
        }
      }}
      {...bottomSheetProps}
    >
      {TitleComponent !== undefined && <TitleComponent />}
      <BottomSheetViewComponent {...bottomSheetViewComponentProps}>
        {ModalContent !== undefined && <ModalContent />}
        {options.map((option: string, index: number) => {
          const icon = get(icons, index);
          return (
            <TouchableHighlight
              underlayColor={colors.highlightColor}
              onPress={() => {
                onPressOption(index);
              }}
              key={index}
            >
              <View style={styles.row}>
                {!isEmpty(icon) && (
                  <IconFont
                    name={icon.name}
                    size={icon.size ?? 20}
                    color={
                      destructiveButtonIndex === index
                        ? colors.red
                        : icon.color ?? colors.textColor
                    }
                    style={{
                      marginRight: 6,
                      marginBottom: Platform.OS === "ios" ? 4 : 0,
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.rowTitle,
                    {
                      color: colors.textColor,
                      marginBottom: isEmpty(icon)
                        ? 0
                        : Platform.OS === "ios"
                        ? 4
                        : 2,
                    },
                    destructiveButtonIndex === index
                      ? {
                          color: colors.red,
                        }
                      : {},
                  ]}
                >
                  {option}
                </Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </BottomSheetViewComponent>
    </BottomSheet>
  );
}

export default BottomSheetModal;
