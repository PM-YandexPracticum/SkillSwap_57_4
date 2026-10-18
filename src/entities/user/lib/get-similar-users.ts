import type { User } from '@/shared/types'

/**
 * Находит список пользователей сначала с той же подкатегорией, что и у автора,
 * затем прибавляет к нему список пользователей с похожей категорией
 *
 * @param users массив пользователей
 * @param author автор навыка
 * @returns массив пользователей с похожими подкатегориями и категориями
 */
export const getSimilarUsers = (users: User[], author: User): User[] => {
  const { categoryId, subcategoryId } = author.teachSkill
  const others = users.filter((user) => user.id !== author.id)

  return [
    ...others.filter((user) => user.teachSkill.subcategoryId === subcategoryId),
    ...others.filter(
      (user) =>
        user.teachSkill.categoryId === categoryId &&
        user.teachSkill.subcategoryId !== subcategoryId,
    ),
  ]
}
