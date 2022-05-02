import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import { TabBar } from "react-native-tab-view";
import { useAuthState } from "context/authContext";
import TabBarItem from "components/tabBar/TabBarItem";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Device from "helpers/device";

const styles = StyleSheet.create({
  indicatorStyle: {
    fontFamily: "Calibre-Medium",
    height: 3,
    top: 42,
  },
  labelStyle: {
    fontFamily: "Calibre-Medium",
    textTransform: "none",
    fontSize: 18,
    marginTop: 0,
  },
});

const deviceWidth = Device.getDeviceWidth();

function TabCustomTouchableNativeFeedback({ children, ...props }: any) {
  return (
    <TouchableNativeFeedback
      {...props}
      background={TouchableNativeFeedback.Ripple("transparent", false)}
      style={[{ width: deviceWidth / props.tabsLength }].concat(props.style)}
    >
      {children}
    </TouchableNativeFeedback>
  );
}

function TabBarComponent(props: any) {
  const { colors } = useAuthState();
  return (
    <TabBar
      {...props}
      labelStyle={styles.labelStyle}
      indicatorStyle={[
        styles.indicatorStyle,
        { color: colors.secondaryGray, backgroundColor: colors.textColor },
      ]}
      activeColor={colors.textColor}
      style={{
        shadowColor: "transparent",
        borderTopWidth: 0,
        shadowOpacity: 0,
        backgroundColor: colors.bgDefault,
        height: 45,
        elevation: 0,
        borderBottomColor: colors.borderColor,
        borderBottomWidth: 1,
        marginTop: 0,
        paddingTop: 0,
      }}
      inactiveColor={colors.secondaryGray}
      tabStyle={{ alignItems: "center", justifyContent: "flex-start" }}
      renderTabBarItem={(item) => {
        return (
          <TabBarItem
            {...item}
            //@ts-ignore
            PressableComponent={
              Device.isIos()
                ? undefined
                : (pressableProps: any) => {
                    return (
                      <TabCustomTouchableNativeFeedback
                        {...pressableProps}
                        tabsLength={props.tabsLength ?? 2}
                      />
                    );
                  }
            }
          />
        );
      }}
    />
  );
}

export default TabBarComponent;
