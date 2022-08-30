import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import rpx from '@/utils/rpx';
import Loading from '@/components/base/loading';
import {Chip, useTheme} from 'react-native-paper';
import useSearch from '../hooks/useSearch';
import {addHistory, getHistory, removeHistory} from '../common/historySearch';
import {useSetAtom} from 'jotai';
import {
  PageStatus,
  pageStatusAtom,
  queryAtom,
  searchResultsAtom,
} from '../store/atoms';
import ThemeText from '@/components/base/themeText';

interface IProps {}
export default function (props: IProps) {
  const [history, setHistory] = useState<string[] | null>(null);
  const search = useSearch();

  const setQuery = useSetAtom(queryAtom);
  const setPageStatus = useSetAtom(pageStatusAtom);
  const setSearchResultsState = useSetAtom(searchResultsAtom);

  useEffect(() => {
    getHistory().then(setHistory);
  }, []);

  return (
    <View style={style.wrapper}>
      {history === null ? (
        <Loading></Loading>
      ) : (
        <>
          <ThemeText fontSize='title' fontWeight='semibold' style={style.title}>历史记录</ThemeText>
          {history.map(_ => (
            <Chip
              key={`search-history-${_}`}
              style={style.chip}
              onClose={async () => {
                await removeHistory(_);
                getHistory().then(setHistory);
              }}
              onPress={() => {
                search(_, 'all');
                addHistory(_);
                setPageStatus(PageStatus.SEARCHING);
                setQuery(_);
              }}>
              {_}
            </Chip>
          ))}
        </>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  wrapper: {
    width: rpx(750),
    maxWidth: rpx(750),
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: rpx(24),
  },
  title: {
    width: '100%',
    marginVertical: rpx(28),
  },
  chip: {
    flexGrow: 0,
    marginRight: rpx(24),
    marginBottom: rpx(24),
  },
});
