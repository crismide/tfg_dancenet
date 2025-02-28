import { Tabs } from "expo-router/tabs";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false ,
        tabBarActiveTintColor: "#C286F1", // Active text color (blue)
        tabBarInactiveTintColor: "#95a5a6", // Inactive text color (gray)

        }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 
                name="house-user" 
                size={size} 
                color={focused ? "#C286F1" : "#95a5a6"} // Blue when active, gray when inactive
                solid={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: "Ideas",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 
                name="lightbulb" 
                size={size} 
                color={focused ? "#C286F1" : "#95a5a6"} // Blue when active, gray when inactive
                solid={focused} />
          ),
        }}
      />

<Tabs.Screen
        name="calendar"
        options={{
          title: "Ensayos",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5 
                name="calendar" 
                size={size} 
                color={focused ? "#C286F1" : "#95a5a6"} // Blue when active, gray when inactive
                solid={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
