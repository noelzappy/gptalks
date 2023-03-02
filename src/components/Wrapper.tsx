import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { useTheme } from '@/hooks';

type Props = {
  children: React.ReactNode;
  scrollable?: boolean;
};

const Wrapper = ({ children, scrollable }: Props) => {
  const { Layout, Common } = useTheme();

  return (
    <SafeAreaView style={[Layout.fill, Common.backgroundPrimary]}>
      {scrollable ? <ScrollView>{children}</ScrollView> : children}
    </SafeAreaView>
  );
};

Wrapper.defaultProps = {
  scrollable: true,
};

export default Wrapper;
