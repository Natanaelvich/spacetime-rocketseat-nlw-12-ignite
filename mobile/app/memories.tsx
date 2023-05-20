import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { api } from '../src/lib/api'
import replaceLocalhostImageUrlToBaseUrl from '../src/utils/replaceLocalhostImageUrlToBaseUrl'
import { LoadMemories } from '../src/components/LoadMemories'

dayjs.locale(ptBR)

interface Memory {
  coverUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    try {
      setLoading(true)
      const token = await SecureStore.getItemAsync('token')

      const response = await api.get('/memories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      let memoriesTemp = response.data

      if (__DEV__) {
        memoriesTemp = response.data.map((memory: Memory) => {
          return {
            ...memory,
            coverUrl: replaceLocalhostImageUrlToBaseUrl(memory.coverUrl),
          }
        }) as Memory[]
      }

      setMemories(memoriesTemp)
    } catch (error) {
      Alert.alert('Erro ao carregar memórias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom + 24, paddingTop: top }}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={loadMemories} />
      }
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      {loading ? (
        <View className="gap-2 px-6">
          <LoadMemories width={'30%'} height={20} />
          <LoadMemories width={'100%'} height={200} />
          <LoadMemories width={'30%'} height={20} />
          <LoadMemories width={'100%'} height={200} />
        </View>
      ) : (
        <View className="mt-6 space-y-10 px-4">
          {memories.map((memory) => {
            return (
              <View key={memory.id} className="space-y-4">
                <View className="flex-row items-center gap-2">
                  <View className="h-px w-5 bg-gray-50" />
                  <Text className="font-body text-sm text-gray-100">
                    {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                  </Text>
                </View>
                <View className="space-y-4 px-8">
                  <Image
                    source={{
                      uri: memory.coverUrl,
                    }}
                    className="aspect-video w-full rounded-lg"
                    alt=""
                  />
                  <Text className="font-body text-base leading-relaxed text-gray-100">
                    {memory.excerpt}
                  </Text>
                  <Link href="/memories/id" asChild>
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <Text className="font-body text-sm text-gray-200">
                        Ler mais
                      </Text>
                      <Icon name="arrow-right" size={16} color="#9e9ea0" />
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            )
          })}
        </View>
      )}
    </ScrollView>
  )
}
