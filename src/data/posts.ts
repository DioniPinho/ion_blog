export interface Author {
  name: string
  avatar: string
}

export interface Category {
  name: string
  slug: string
}

export interface Tag {
  name: string
  slug: string
}

export interface Post {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  author: Author
  publishDate: string
  readingTime: string
  categories: Category[]
  tags: Tag[]
}

export const mockPosts: Post[] = [
  {
    title: 'Introdução ao DevOps: Princípios e Práticas',
    slug: 'introducao-ao-devops',
    excerpt: 'Descubra os fundamentos do DevOps e como essa cultura pode transformar o desenvolvimento de software na sua empresa.',
    coverImage: '/images/posts/devops-intro.jpg',
    author: {
      name: 'João Silva',
      avatar: '/images/authors/joao-silva.jpg'
    },
    publishDate: '2024-02-21',
    readingTime: '5 min',
    categories: [
      { name: 'DevOps', slug: 'devops' }
    ],
    tags: [
      { name: 'DevOps', slug: 'devops' },
      { name: 'Cultura', slug: 'cultura' },
      { name: 'Automação', slug: 'automacao' }
    ]
  },
  {
    title: 'Cloud Computing: Um Guia Completo',
    slug: 'cloud-computing-guia',
    excerpt: 'Entenda os conceitos fundamentais de cloud computing e como escolher a melhor solução para seu negócio.',
    coverImage: '/images/posts/cloud-guide.jpg',
    author: {
      name: 'Maria Santos',
      avatar: '/images/authors/maria-santos.jpg'
    },
    publishDate: '2024-02-20',
    readingTime: '8 min',
    categories: [
      { name: 'Cloud', slug: 'cloud' }
    ],
    tags: [
      { name: 'AWS', slug: 'aws' },
      { name: 'Azure', slug: 'azure' },
      { name: 'GCP', slug: 'gcp' }
    ]
  },
  {
    title: 'Kubernetes na Prática',
    slug: 'kubernetes-na-pratica',
    excerpt: 'Um guia prático sobre como implementar e gerenciar clusters Kubernetes em ambiente de produção.',
    coverImage: '/images/posts/kubernetes.jpg',
    author: {
      name: 'Pedro Costa',
      avatar: '/images/authors/pedro-costa.jpg'
    },
    publishDate: '2024-02-19',
    readingTime: '10 min',
    categories: [
      { name: 'Containers', slug: 'containers' }
    ],
    tags: [
      { name: 'Kubernetes', slug: 'kubernetes' },
      { name: 'Docker', slug: 'docker' },
      { name: 'Orquestração', slug: 'orquestracao' }
    ]
  }
] 