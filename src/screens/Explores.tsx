import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks';
import { Wrapper } from '@/components';

const Screen = () => {
  const { t } = useTranslation('example');

  const { Fonts, Gutters, Layout } = useTheme();
  const dispatch = useDispatch();

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(i + 1);
  }, [dispatch]);

  return (
    <Wrapper>
      <View style={[Layout.fullWidth, Gutters.smallVMargin]}>
        <Text style={[Fonts.titleSmall, Gutters.smallBMargin]}>
          {t('titles.themeChoice')} {i}
        </Text>
      </View>
    </Wrapper>
  );
};

export default Screen;
