import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { api } from '../../src/lib/api'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import { LoadMemories } from '../../src/components/LoadMemories'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@expo/vector-icons/Feather'

type Memory = {
  id: string
  coverUrl: string
  content: string
  createdAt: string
}

const MemoryDetails = () => {
  const { bottom, top } = useSafeAreaInsets()
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const [memory, setMemory] = useState<Memory | undefined>()
  const [loading, setLoading] = useState(true)

  console.log(id, memory)
  useEffect(() => {
    async function loadMemory() {
      try {
        setLoading(true)
        const token = await SecureStore.getItemAsync('token')

        const response = await api.get<Memory>(`/memories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setMemory(response.data)
      } catch (error) {
        Alert.alert('Erro ao carregar memória')
      } finally {
        setLoading(false)
      }
    }

    loadMemory()
  }, [id])

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: bottom + 20,
        paddingTop: top + 20,
      }}
    >
      {/* header with button back */}
      <TouchableOpacity
        onPress={router.back}
        className="flex-row items-center gap-2 px-6 py-6"
      >
        <Icon name="chevron-left" size={24} color="#fff" />
        <Text className="font-body text-lg text-gray-100">Voltar</Text>
      </TouchableOpacity>

      {loading ? (
        <View className="gap-2 px-6">
          <LoadMemories width={'30%'} height={20} />
          <LoadMemories width={'100%'} height={200} />
          <LoadMemories width={'30%'} height={20} />
          <LoadMemories width={'100%'} height={200} />
        </View>
      ) : (
        <>
          <View className="flex-row items-center gap-2">
            <View className="h-px w-5 bg-gray-50" />
            <Text className="font-body text-sm text-gray-100">
              {!!memory.createdAt &&
                dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
            </Text>
          </View>
          <View className="space-y-4 px-8">
            <Image
              source={{
                uri: memory?.coverUrl,
              }}
              className="aspect-video w-full rounded-lg"
              alt=""
            />
            <Text className="font-body text-base leading-relaxed text-gray-100">
              {memory?.content}
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  )
}

export default MemoryDetails
