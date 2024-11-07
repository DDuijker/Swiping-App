import React from "react";
import AppProviders from "../components/AppProviders";
import { Slot } from "expo-router";
export default function MainLayout() {
  return (
    <AppProviders>
      <Slot />
    </AppProviders>
  );
}
